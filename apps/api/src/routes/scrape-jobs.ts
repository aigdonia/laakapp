import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { scrapeJobs, scrapeExecutions, dataSources } from "../db/schema";
import { scrapeJobsInsert, scrapeJobsUpdate } from "../validation/schemas";
import { executeJob } from "../lib/job-executor";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

// List all jobs with latest execution + data source name
app.get("/", async (c) => {
  const jobs = await db(c).select().from(scrapeJobs).all();
  const sources = await db(c).select().from(dataSources).all();
  const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]));

  const result = await Promise.all(
    jobs.map(async (job) => {
      const lastExecution = await db(c)
        .select()
        .from(scrapeExecutions)
        .where(eq(scrapeExecutions.jobId, job.id))
        .orderBy(desc(scrapeExecutions.createdAt))
        .limit(1)
        .get();

      return {
        ...job,
        lastExecution: lastExecution ?? null,
        dataSourceName: sourceById[job.dataSourceId]?.name ?? "Unknown",
      };
    })
  );

  return c.json(result);
});

// Get single job with recent executions
app.get("/:id", async (c) => {
  const job = await db(c)
    .select()
    .from(scrapeJobs)
    .where(eq(scrapeJobs.id, c.req.param("id")))
    .get();
  if (!job) return c.json({ error: "Not found" }, 404);

  const executions = await db(c)
    .select()
    .from(scrapeExecutions)
    .where(eq(scrapeExecutions.jobId, job.id))
    .orderBy(desc(scrapeExecutions.createdAt))
    .limit(20)
    .all();

  return c.json({ ...job, executions });
});

// Create job
app.post("/", async (c) => {
  const raw = await c.req.json();
  const parsed = scrapeJobsInsert.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const row = await db(c)
    .insert(scrapeJobs)
    .values(parsed.data)
    .returning()
    .get();
  return c.json(row, 201);
});

// Update job
app.put("/:id", async (c) => {
  const raw = await c.req.json();
  const parsed = scrapeJobsUpdate.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const row = await db(c)
    .update(scrapeJobs)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(scrapeJobs.id, c.req.param("id")))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

// Toggle enabled (pause/resume)
app.post("/:id/toggle", async (c) => {
  const job = await db(c)
    .select()
    .from(scrapeJobs)
    .where(eq(scrapeJobs.id, c.req.param("id")))
    .get();
  if (!job) return c.json({ error: "Not found" }, 404);

  const row = await db(c)
    .update(scrapeJobs)
    .set({ enabled: !job.enabled, updatedAt: new Date().toISOString() })
    .where(eq(scrapeJobs.id, job.id))
    .returning()
    .get();
  return c.json(row);
});

// Run now — spawn a new execution and execute inline
app.post("/:id/run", async (c) => {
  const job = await db(c)
    .select()
    .from(scrapeJobs)
    .where(eq(scrapeJobs.id, c.req.param("id")))
    .get();
  if (!job) return c.json({ error: "Not found" }, 404);

  const trigger = (c.req.query("trigger") ?? "manual") as "manual" | "cron" | "retry";
  const bucket = c.env.BACKUP_BUCKET;

  try {
    const execution = await executeJob(job, trigger, db(c), bucket);
    return c.json(execution);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return c.json({ error: msg }, 500);
  }
});

// Delete job + all executions
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db(c).delete(scrapeExecutions).where(eq(scrapeExecutions.jobId, id));
  await db(c).delete(scrapeJobs).where(eq(scrapeJobs.id, id));
  return c.json({ success: true });
});

export default app;
