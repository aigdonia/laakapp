import { Hono } from "hono";
import { eq, and, inArray } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import {
  stockCompliance,
  stocks,
  screeningRules,
  lookups,
  stockFinancials,
} from "../db/schema";
import { screenStock } from "../lib/screening-engine";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db" as never) as Database;
}

const app = new Hono<Env>();

// List with filters
app.get("/", async (c) => {
  const stockId = c.req.query("stockId");
  const screeningRuleId = c.req.query("screeningRuleId");
  const status = c.req.query("status");
  const countryCode = c.req.query("countryCode");

  // If countryCode filter, first get stock IDs for that country
  let countryStockIds: string[] | null = null;
  if (countryCode) {
    const countryStocks = await db(c)
      .select({ id: stocks.id })
      .from(stocks)
      .where(eq(stocks.countryCode, countryCode.toUpperCase()))
      .all();
    countryStockIds = countryStocks.map((s) => s.id);
    if (countryStockIds.length === 0) return c.json([]);
  }

  const conditions = [];
  if (stockId) conditions.push(eq(stockCompliance.stockId, stockId));
  if (screeningRuleId)
    conditions.push(eq(stockCompliance.screeningRuleId, screeningRuleId));
  if (status)
    conditions.push(eq(stockCompliance.status, status as never));
  if (countryStockIds)
    conditions.push(inArray(stockCompliance.stockId, countryStockIds));

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];
  const rows = await db(c)
    .select()
    .from(stockCompliance)
    .where(where)
    .all();

  return c.json(rows);
});

// Mobile endpoint: lean compliance map by symbols + ruleSlug
app.get("/by-symbols", async (c) => {
  const symbolsParam = c.req.query("symbols");
  const ruleSlug = c.req.query("ruleSlug");

  if (!symbolsParam || !ruleSlug) {
    return c.json({ error: "symbols and ruleSlug required" }, 400);
  }

  const symbolList = symbolsParam
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  // Get screening rule
  const rule = await db(c)
    .select()
    .from(screeningRules)
    .where(eq(screeningRules.slug, ruleSlug))
    .get();

  if (!rule) return c.json({ error: "Screening rule not found" }, 404);

  // Get stocks by symbols
  const matchedStocks = await db(c)
    .select()
    .from(stocks)
    .where(inArray(stocks.symbol, symbolList))
    .all();

  if (matchedStocks.length === 0) return c.json({});

  const stockIds = matchedStocks.map((s) => s.id);
  const symbolById = Object.fromEntries(
    matchedStocks.map((s) => [s.id, s.symbol])
  );

  // Get compliance records
  const records = await db(c)
    .select()
    .from(stockCompliance)
    .where(
      and(
        inArray(stockCompliance.stockId, stockIds),
        eq(stockCompliance.screeningRuleId, rule.id)
      )
    )
    .all();

  // Build lean map: symbol → { status, layer, ratios }
  const result: Record<
    string,
    {
      status: string;
      layer: string;
      ratios: {
        debtRatio: number | null;
        cashInterestRatio: number | null;
        receivablesRatio: number | null;
        nonPermissibleIncomeRatio: number | null;
      };
    }
  > = {};

  for (const r of records) {
    const symbol = symbolById[r.stockId];
    if (!symbol) continue;
    result[symbol] = {
      status: r.status,
      layer: r.layer,
      ratios: {
        debtRatio: r.debtRatio,
        cashInterestRatio: r.cashInterestRatio,
        receivablesRatio: r.receivablesRatio,
        nonPermissibleIncomeRatio: r.nonPermissibleIncomeRatio,
      },
    };
  }

  return c.json(result);
});

// Manual override from admin
app.post("/", async (c) => {
  const body = await c.req.json();
  const row = await db(c)
    .insert(stockCompliance)
    .values(body)
    .returning()
    .get();
  return c.json(row, 201);
});

// Bulk upsert from scraper
app.post("/bulk", async (c) => {
  const items = await c.req.json<
    Array<Record<string, unknown>>
  >();

  let created = 0;
  let updated = 0;

  for (const item of items) {
    const existing = await db(c)
      .select()
      .from(stockCompliance)
      .where(
        and(
          eq(stockCompliance.stockId, item.stockId as string),
          eq(stockCompliance.screeningRuleId, item.screeningRuleId as string),
          eq(stockCompliance.validFrom, item.validFrom as string)
        )
      )
      .get();

    if (existing) {
      await db(c)
        .update(stockCompliance)
        .set({ ...item, updatedAt: new Date().toISOString() } as never)
        .where(eq(stockCompliance.id, existing.id));
      updated++;
    } else {
      await db(c)
        .insert(stockCompliance)
        .values(item as never);
      created++;
    }
  }

  return c.json({ created, updated }, 201);
});

// Run screening engine for given stocks
app.post("/run-screening", async (c) => {
  const { stockIds, screeningRuleId } = await c.req.json<{
    stockIds?: string[];
    screeningRuleId?: string;
  }>();

  // Get all screening rules (or specific one)
  const rules = screeningRuleId
    ? await db(c)
        .select()
        .from(screeningRules)
        .where(eq(screeningRules.id, screeningRuleId))
        .all()
    : await db(c)
        .select()
        .from(screeningRules)
        .where(eq(screeningRules.enabled, true))
        .all();

  // Get stocks
  const targetStocks = stockIds
    ? await db(c)
        .select()
        .from(stocks)
        .where(inArray(stocks.id, stockIds))
        .all()
    : await db(c).select().from(stocks).all();

  // Get haram sectors from lookups
  const haramLookups = await db(c)
    .select()
    .from(lookups)
    .where(
      and(eq(lookups.category, "haram_sectors"), eq(lookups.enabled, true))
    )
    .all();
  const haramSectors = haramLookups.map((l) => l.value);

  // TODO: Index memberships — for now, empty (Phase 2)
  const indexMemberships: string[] = [];

  const now = new Date().toISOString();
  const validFrom = now.split("T")[0]; // date only
  let screened = 0;

  for (const stock of targetStocks) {
    // Get latest financials for this stock
    const fin = await db(c)
      .select()
      .from(stockFinancials)
      .where(eq(stockFinancials.stockId, stock.id))
      .all();

    const latestFin = fin.sort(
      (a, b) => b.fiscalYear - a.fiscalYear
    )[0] ?? null;

    for (const rule of rules) {
      const denominatorType =
        (rule.thresholds as Record<string, unknown>).denominator_type === "total_assets"
          ? "total_assets"
          : "market_cap";

      const result = screenStock({
        sector: stock.sector,
        haramSectors,
        indexMemberships,
        financials: latestFin
          ? {
              totalDebt: latestFin.totalDebt,
              cashAndEquivalents: latestFin.cashAndEquivalents,
              interestBearingDeposits: latestFin.interestBearingDeposits,
              receivables: latestFin.receivables,
              marketCap: latestFin.marketCap,
              totalAssets: latestFin.totalAssets,
              totalRevenue: latestFin.totalRevenue,
              nonPermissibleRevenue: latestFin.nonPermissibleRevenue,
            }
          : null,
        thresholds: rule.thresholds as Record<string, number>,
        denominatorType,
      });

      // Upsert compliance record
      const existing = await db(c)
        .select()
        .from(stockCompliance)
        .where(
          and(
            eq(stockCompliance.stockId, stock.id),
            eq(stockCompliance.screeningRuleId, rule.id),
            eq(stockCompliance.validFrom, validFrom)
          )
        )
        .get();

      const complianceData = {
        stockId: stock.id,
        screeningRuleId: rule.id,
        status: result.status,
        layer: result.layer,
        debtRatio: result.ratios.debtRatio,
        cashInterestRatio: result.ratios.cashInterestRatio,
        receivablesRatio: result.ratios.receivablesRatio,
        nonPermissibleIncomeRatio: result.ratios.nonPermissibleIncomeRatio,
        source: "auto" as const,
        validFrom,
      };

      if (existing) {
        await db(c)
          .update(stockCompliance)
          .set({ ...complianceData, updatedAt: now })
          .where(eq(stockCompliance.id, existing.id));
      } else {
        await db(c).insert(stockCompliance).values(complianceData);
      }

      screened++;
    }
  }

  return c.json({
    screened,
    stocks: targetStocks.length,
    rules: rules.length,
  });
});

// Update (for admin edits)
app.put("/:id", async (c) => {
  const body = await c.req.json();
  const row = await db(c)
    .update(stockCompliance)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(stockCompliance.id, c.req.param("id")))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

// Delete
app.delete("/:id", async (c) => {
  await db(c)
    .delete(stockCompliance)
    .where(eq(stockCompliance.id, c.req.param("id")));
  return c.json({ success: true });
});

export default app;
