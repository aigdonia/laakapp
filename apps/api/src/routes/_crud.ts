import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import type { ZodType } from "zod";

type AnyTable = SQLiteTableWithColumns<any>;

type CrudOptions = {
  orderable?: boolean;
  insertSchema?: ZodType;
  updateSchema?: ZodType;
};

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

export function crudRoutes<T extends AnyTable>(
  table: T,
  options?: CrudOptions
) {
  const app = new Hono<Env>();

  app.get("/", async (c) => {
    const rows = await db(c).select().from(table).all();
    return c.json(rows);
  });

  app.get("/:id", async (c) => {
    const row = await db(c)
      .select()
      .from(table)
      .where(eq(table.id, c.req.param("id")))
      .get();
    if (!row) return c.json({ error: "Not found" }, 404);
    return c.json(row);
  });

  app.post("/", async (c) => {
    const raw = await c.req.json();

    if (options?.insertSchema) {
      const result = options.insertSchema.safeParse(raw);
      if (!result.success) {
        return c.json(
          { error: "validation_error", issues: result.error.issues },
          400
        );
      }
      const row = await db(c)
        .insert(table)
        .values(result.data as any)
        .returning()
        .get();
      return c.json(row, 201);
    }

    const row = await db(c).insert(table).values(raw).returning().get();
    return c.json(row, 201);
  });

  app.put("/:id", async (c) => {
    const raw = await c.req.json();

    if (options?.updateSchema) {
      const result = options.updateSchema.safeParse(raw);
      if (!result.success) {
        return c.json(
          { error: "validation_error", issues: result.error.issues },
          400
        );
      }
      const row = await db(c)
        .update(table)
        .set({ ...(result.data as any), updatedAt: new Date().toISOString() })
        .where(eq(table.id, c.req.param("id")))
        .returning()
        .get();
      if (!row) return c.json({ error: "Not found" }, 404);
      return c.json(row);
    }

    const row = await db(c)
      .update(table)
      .set({ ...raw, updatedAt: new Date().toISOString() })
      .where(eq(table.id, c.req.param("id")))
      .returning()
      .get();
    if (!row) return c.json({ error: "Not found" }, 404);
    return c.json(row);
  });

  app.delete("/:id", async (c) => {
    await db(c).delete(table).where(eq(table.id, c.req.param("id")));
    return c.json({ success: true });
  });

  if (options?.orderable) {
    app.post("/reorder", async (c) => {
      const { ids } = await c.req.json<{ ids: string[] }>();
      const now = new Date().toISOString();
      await Promise.all(
        ids.map((id, index) =>
          db(c)
            .update(table)
            .set({ order: index, updatedAt: now } as any)
            .where(eq(table.id, id))
        )
      );
      return c.json({ success: true });
    });
  }

  return app;
}
