import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { scrapeJobs } from "../db/schema";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

// List with status filter
app.get("/", async (c) => {
  const status = c.req.query("status");
  if (status) {
    const rows = await db(c)
      .select()
      .from(scrapeJobs)
      .where(eq(scrapeJobs.status, status as never))
      .all();
    return c.json(rows);
  }
  const rows = await db(c).select().from(scrapeJobs).all();
  return c.json(rows);
});

// Get single
app.get("/:id", async (c) => {
  const row = await db(c)
    .select()
    .from(scrapeJobs)
    .where(eq(scrapeJobs.id, c.req.param("id")))
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

// Create job (admin trigger)
app.post("/", async (c) => {
  const body = await c.req.json();
  const row = await db(c)
    .insert(scrapeJobs)
    .values(body)
    .returning()
    .get();
  return c.json(row, 201);
});

// Update progress (scraper calls this)
app.put("/:id", async (c) => {
  const body = await c.req.json();
  const row = await db(c)
    .update(scrapeJobs)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(scrapeJobs.id, c.req.param("id")))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

// Cancel a job
app.post("/:id/cancel", async (c) => {
  const row = await db(c)
    .update(scrapeJobs)
    .set({
      status: "failed",
      errorMessage: "Cancelled by admin",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(scrapeJobs.id, c.req.param("id")))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

// Delete
app.delete("/:id", async (c) => {
  await db(c)
    .delete(scrapeJobs)
    .where(eq(scrapeJobs.id, c.req.param("id")));
  return c.json({ success: true });
});

export default app;
