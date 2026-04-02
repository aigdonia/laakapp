import { Hono } from "hono";
import { eq, inArray, gt, and, like, or, sql } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { stocks } from "../db/schema";
import { crudRoutes } from "./_crud";
import { stocksInsert, stocksUpdate } from "../validation/schemas";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

// GET with pagination, search, country filter
app.get("/", async (c) => {
  const countriesParam = c.req.query("countries");
  const updatedSince = c.req.query("updatedSince");
  const page = c.req.query("page");
  const limit = c.req.query("limit");
  const search = c.req.query("search");
  const countryCode = c.req.query("countryCode");
  const exchange = c.req.query("exchange");
  const sector = c.req.query("sector");

  // Paginated mode (admin)
  if (page || search || countryCode || exchange || sector) {
    const pageNum = Math.max(1, parseInt(page ?? "1") || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit ?? "20") || 20));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    if (search) {
      const term = `%${search}%`;
      conditions.push(
        or(
          like(stocks.symbol, term),
          like(stocks.name, term)
        )!
      );
    }
    if (countryCode) {
      conditions.push(eq(stocks.countryCode, countryCode.toUpperCase()));
    }
    if (exchange) {
      conditions.push(eq(stocks.exchange, exchange));
    }
    if (sector) {
      conditions.push(eq(stocks.sector, sector));
    }

    const where = conditions.length > 1 ? and(...conditions) : conditions[0];

    const [rows, countResult] = await Promise.all([
      db(c)
        .select()
        .from(stocks)
        .where(where)
        .limit(limitNum)
        .offset(offset)
        .all(),
      db(c)
        .select({ count: sql<number>`count(*)` })
        .from(stocks)
        .where(where)
        .get(),
    ]);

    return c.json({
      data: rows,
      total: countResult?.count ?? 0,
      page: pageNum,
      limit: limitNum,
    });
  }

  // Mobile sync mode: countries + updatedSince
  if (countriesParam || updatedSince) {
    const conditions = [];
    if (countriesParam) {
      const codes = countriesParam
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
      if (codes.length > 0) {
        conditions.push(inArray(stocks.countryCode, codes));
      }
    }
    if (updatedSince) {
      conditions.push(gt(stocks.updatedAt, updatedSince));
    }

    const where = conditions.length > 1 ? and(...conditions) : conditions[0];
    const rows = await db(c)
      .select()
      .from(stocks)
      .where(where)
      .all();

    return c.json({
      data: rows,
      syncedAt: new Date().toISOString(),
    });
  }

  // No params = backward-compatible plain array
  const rows = await db(c).select().from(stocks).all();
  return c.json(rows);
});

// Mount standard CRUD (GET "/" already handled above, CRUD adds /:id, POST, PUT, DELETE)
app.route("/", crudRoutes(stocks, {
  insertSchema: stocksInsert,
  updateSchema: stocksUpdate,
}));

// Bulk upsert by symbol
app.post("/bulk", async (c) => {
  const items = await c.req.json<
    Array<{
      symbol: string;
      name: string;
      countryCode: string;
      exchange: string;
      sector?: string;
      lastPrice?: number | null;
      enabled?: boolean;
    }>
  >();

  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const item of items) {
    if (!item.symbol || !item.name || !item.countryCode || !item.exchange) {
      errors.push(
        `Missing required fields for row: ${item.symbol || "(no symbol)"}`
      );
      continue;
    }

    const now = new Date().toISOString();

    const existing = await db(c)
      .select()
      .from(stocks)
      .where(eq(stocks.symbol, item.symbol.toUpperCase()))
      .get();

    const base = {
      symbol: item.symbol.toUpperCase(),
      name: item.name,
      countryCode: item.countryCode.toUpperCase(),
      exchange: item.exchange,
      sector: item.sector ?? "",
      enabled: item.enabled ?? true,
      lastPrice: item.lastPrice ?? null,
      lastPriceUpdatedAt: item.lastPrice != null ? now : null,
    };

    if (existing) {
      await db(c)
        .update(stocks)
        .set({ ...base, updatedAt: now })
        .where(eq(stocks.id, existing.id));
      updated++;
    } else {
      await db(c).insert(stocks).values(base);
      created++;
    }
  }

  return c.json({ created, updated, errors }, 201);
});

export default app;
