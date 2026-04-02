import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { stockFinancials } from "../db/schema";
import { crudRoutes } from "./_crud";
import { stockFinancialsInsert, stockFinancialsUpdate } from "../validation/schemas";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

// Mount standard CRUD
app.route("/", crudRoutes(stockFinancials, {
  insertSchema: stockFinancialsInsert,
  updateSchema: stockFinancialsUpdate,
}));

// Bulk insert from scraper
app.post("/bulk", async (c) => {
  const items = await c.req.json<Array<Record<string, unknown>>>();

  let created = 0;
  let updated = 0;

  for (const item of items) {
    const existing = await db(c)
      .select()
      .from(stockFinancials)
      .where(
        and(
          eq(stockFinancials.stockId, item.stockId as string),
          eq(stockFinancials.fiscalYear, item.fiscalYear as number),
          eq(stockFinancials.fiscalPeriod, item.fiscalPeriod as never),
          eq(stockFinancials.source, item.source as never)
        )
      )
      .get();

    if (existing) {
      await db(c)
        .update(stockFinancials)
        .set({ ...item, updatedAt: new Date().toISOString() } as never)
        .where(eq(stockFinancials.id, existing.id));
      updated++;
    } else {
      await db(c)
        .insert(stockFinancials)
        .values(item as never);
      created++;
    }
  }

  return c.json({ created, updated }, 201);
});

export default app;
