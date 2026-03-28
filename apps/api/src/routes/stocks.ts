import { Hono } from "hono";
import { eq, inArray, gt, and } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { stocks } from "../db/schema";
import { crudRoutes } from "./_crud";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db" as never) as Database;
}

const app = new Hono<Env>();

// Filtered GET with countries + updatedSince (must be before CRUD mount)
app.get("/", async (c) => {
  const countriesParam = c.req.query("countries");
  const updatedSince = c.req.query("updatedSince");

  // No params = backward-compatible plain array
  if (!countriesParam && !updatedSince) {
    const rows = await db(c).select().from(stocks).all();
    return c.json(rows);
  }

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
});

// Mount standard CRUD (GET "/" already handled above, CRUD adds /:id, POST, PUT, DELETE)
app.route("/", crudRoutes(stocks));

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
