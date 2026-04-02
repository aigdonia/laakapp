import { Hono } from "hono";
import { z } from "zod";
import { eq, and, sql, gt } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import {
  eventTypes,
  activityRules,
  activityEvents,
  activityCompletions,
} from "../db/schema";
import { creditBack } from "../lib/revenuecat";
import type { TriggeredAction } from "@fin-ai/shared";

const trackEventSchema = z.object({
  eventType: z.string().min(1).max(100),
  metadata: z.record(z.string(), z.unknown()).optional(),
  idempotencyKey: z.string().max(200).optional(),
});

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

app.post("/events", async (c) => {
  const customerId = c.get("userId");

  const raw = await c.req.json();
  const parsed = trackEventSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const body = parsed.data;

  // 1. Validate event type against registry
  const eventType = await db(c)
    .select()
    .from(eventTypes)
    .where(
      and(eq(eventTypes.slug, body.eventType), eq(eventTypes.enabled, true))
    )
    .get();

  if (!eventType) {
    return c.json({ error: "invalid_event_type" }, 400);
  }

  // 2. Rate limiting: 1 per type per 60s
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  const recentSameType = await db(c)
    .select({ count: sql<number>`count(*)` })
    .from(activityEvents)
    .where(
      and(
        eq(activityEvents.customerId, customerId),
        eq(activityEvents.eventType, body.eventType),
        gt(activityEvents.createdAt, oneMinuteAgo)
      )
    )
    .get();

  if ((recentSameType?.count ?? 0) >= 1) {
    return c.json({ triggered: [], throttled: true });
  }

  // 3. Rate limiting: 50 per day
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const dailyCount = await db(c)
    .select({ count: sql<number>`count(*)` })
    .from(activityEvents)
    .where(
      and(
        eq(activityEvents.customerId, customerId),
        gt(activityEvents.createdAt, todayStart.toISOString())
      )
    )
    .get();

  if ((dailyCount?.count ?? 0) >= 50) {
    return c.json({ triggered: [], throttled: true });
  }

  // 4. Idempotency check
  if (body.idempotencyKey) {
    const existing = await db(c)
      .select({ id: activityEvents.id })
      .from(activityEvents)
      .where(
        and(
          eq(activityEvents.customerId, customerId),
          eq(activityEvents.idempotencyKey, body.idempotencyKey)
        )
      )
      .get();

    if (existing) {
      return c.json({ triggered: [] });
    }
  }

  // 5. Insert event
  await db(c).insert(activityEvents).values({
    customerId,
    eventType: body.eventType,
    metadata: body.metadata ?? {},
    idempotencyKey: body.idempotencyKey ?? null,
  });

  // 6. Count events for this type
  const countResult = await db(c)
    .select({ count: sql<number>`count(*)` })
    .from(activityEvents)
    .where(
      and(
        eq(activityEvents.customerId, customerId),
        eq(activityEvents.eventType, body.eventType)
      )
    )
    .get();

  const eventCount = countResult?.count ?? 0;

  // 7. Find matching enabled rules
  const matchingRules = await db(c)
    .select()
    .from(activityRules)
    .where(
      and(
        eq(activityRules.eventType, body.eventType),
        eq(activityRules.enabled, true)
      )
    )
    .all();

  // 8. Evaluate rules
  const triggered: TriggeredAction[] = [];

  for (const rule of matchingRules) {
    if (eventCount < rule.threshold) continue;

    // Check if already completed
    const completion = await db(c)
      .select({ id: activityCompletions.id })
      .from(activityCompletions)
      .where(
        and(
          eq(activityCompletions.customerId, customerId),
          eq(activityCompletions.ruleId, rule.id)
        )
      )
      .get();

    if (completion) continue;

    // Mark as completed (UNIQUE constraint is safety net)
    try {
      await db(c).insert(activityCompletions).values({
        customerId,
        ruleId: rule.id,
      });
    } catch {
      // UNIQUE constraint violation = already completed (race condition)
      continue;
    }

    // Execute reward_credits server-side
    if (rule.actionType === "reward_credits") {
      const amount = (rule.actionPayload as { amount?: number }).amount;
      if (amount && amount > 0) {
        try {
          const { RC_SECRET_KEY, RC_PROJECT_ID } = c.env;
          await creditBack(
            RC_SECRET_KEY,
            RC_PROJECT_ID,
            customerId,
            amount,
            `activity:${rule.id}`
          );
        } catch {
          // Credit reward failed — still report the trigger so mobile can show message
        }
      }
    }

    triggered.push({
      actionType: rule.actionType as TriggeredAction["actionType"],
      payload: rule.actionPayload,
    });
  }

  return c.json({ triggered });
});

export default app;

/** Purge activity events older than 90 days. Call from scheduled worker. */
export async function purgeOldActivityEvents(db_: Database) {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  await db_
    .delete(activityEvents)
    .where(sql`${activityEvents.createdAt} < ${cutoff}`);
}
