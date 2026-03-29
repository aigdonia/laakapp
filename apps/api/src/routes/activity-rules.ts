import { Hono } from "hono";
import { eq, and, sql } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { activityRules, activityEvents, activityCompletions } from "../db/schema";
import { crudRoutes } from "./_crud";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const crud = crudRoutes(activityRules, { orderable: true });

const app = new Hono<Env>();

// Mount CRUD routes
app.route("/", crud);

// Test rule against a specific customer (read-only)
app.get("/:id/test", async (c) => {
  const ruleId = c.req.param("id");
  const customerId = c.req.query("customerId");
  if (!customerId) {
    return c.json({ error: "customerId query param required" }, 400);
  }

  const rule = await db(c)
    .select()
    .from(activityRules)
    .where(eq(activityRules.id, ruleId))
    .get();

  if (!rule) {
    return c.json({ error: "Rule not found" }, 404);
  }

  const countResult = await db(c)
    .select({ count: sql<number>`count(*)` })
    .from(activityEvents)
    .where(
      and(
        eq(activityEvents.customerId, customerId),
        eq(activityEvents.eventType, rule.eventType)
      )
    )
    .get();

  const eventCount = countResult?.count ?? 0;

  const completion = await db(c)
    .select()
    .from(activityCompletions)
    .where(
      and(
        eq(activityCompletions.customerId, customerId),
        eq(activityCompletions.ruleId, ruleId)
      )
    )
    .get();

  return c.json({
    eventCount,
    threshold: rule.threshold,
    wouldTrigger: eventCount >= rule.threshold && !completion,
    alreadyCompleted: !!completion,
  });
});

export default app;
