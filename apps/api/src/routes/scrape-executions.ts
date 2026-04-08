import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { scrapeExecutions } from "../db/schema";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

// List executions for a job
app.get("/", async (c) => {
  const jobId = c.req.query("jobId");
  if (!jobId) {
    const rows = await db(c)
      .select()
      .from(scrapeExecutions)
      .orderBy(desc(scrapeExecutions.createdAt))
      .limit(50)
      .all();
    return c.json(rows);
  }
  const rows = await db(c)
    .select()
    .from(scrapeExecutions)
    .where(eq(scrapeExecutions.jobId, jobId))
    .orderBy(desc(scrapeExecutions.createdAt))
    .all();
  return c.json(rows);
});

// Get single execution
app.get("/:id", async (c) => {
  const row = await db(c)
    .select()
    .from(scrapeExecutions)
    .where(eq(scrapeExecutions.id, c.req.param("id")))
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

// Get execution logs from R2
app.get("/:id/logs", async (c) => {
  const exec = await db(c)
    .select()
    .from(scrapeExecutions)
    .where(eq(scrapeExecutions.id, c.req.param("id")))
    .get();
  if (!exec) return c.json({ error: "Not found" }, 404);
  if (!exec.logKey) return c.json({ logs: [] });

  const bucket = c.env.BACKUP_BUCKET;
  const obj = await bucket.get(exec.logKey);
  if (!obj) return c.json({ logs: [] });

  const text = await obj.text();
  const logs = text
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  return c.json({ logs });
});

// Delete execution
app.delete("/:id", async (c) => {
  await db(c)
    .delete(scrapeExecutions)
    .where(eq(scrapeExecutions.id, c.req.param("id")));
  return c.json({ success: true });
});

export default app;
