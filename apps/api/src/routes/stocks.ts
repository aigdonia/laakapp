import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { stocks } from "../db/schema";
import { crudRoutes } from "./_crud";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db" as never) as Database;
}

const app = new Hono<Env>();

// Mount standard CRUD
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
