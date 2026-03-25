import { Hono } from "hono";
import type { Env } from "../index";
import type { Database } from "../db";
import { appSettings } from "../db/schema";

const app = new Hono<Env>();

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db" as never) as Database;
}

// GET / — return the singleton row (or create default)
app.get("/", async (c) => {
  let row = await db(c).select().from(appSettings).get();
  if (!row) {
    row = await db(c).insert(appSettings).values({}).returning().get();
  }
  return c.json(row);
});

// PUT / — update the singleton row
app.put("/", async (c) => {
  const body = await c.req.json();

  let row = await db(c).select().from(appSettings).get();
  if (!row) {
    row = await db(c).insert(appSettings).values(body).returning().get();
  } else {
    row = await db(c)
      .update(appSettings)
      .set({ ...body, updatedAt: new Date().toISOString() })
      .returning()
      .get();
  }
  return c.json(row);
});

export default app;
