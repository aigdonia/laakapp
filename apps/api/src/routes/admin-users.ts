import { Hono } from "hono";
import { eq, sql, and, desc } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import {
  userProfiles,
  activityEvents,
  activityCompletions,
  activityRules,
  creditTransactions,
  pushTokens,
  backupSnapshots,
} from "../db/schema";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

// Admin-only guard
app.use("*", async (c, next) => {
  if (c.get("userId") !== "admin") {
    return c.json({ error: "forbidden" }, 403);
  }
  return next();
});

/** List all users with aggregates */
app.get("/", async (c) => {
  // Collect all unique user IDs across tables
  const [profileUsers, eventUsers, tokenUsers, txUsers] = await Promise.all([
    db(c)
      .select({ userId: userProfiles.userId })
      .from(userProfiles)
      .all(),
    db(c)
      .selectDistinct({ userId: activityEvents.customerId })
      .from(activityEvents)
      .all(),
    db(c)
      .selectDistinct({ userId: pushTokens.userId })
      .from(pushTokens)
      .all(),
    db(c)
      .selectDistinct({ userId: creditTransactions.customerId })
      .from(creditTransactions)
      .all(),
  ]);

  const allIds = new Set([
    ...profileUsers.map((r) => r.userId),
    ...eventUsers.map((r) => r.userId),
    ...tokenUsers.map((r) => r.userId),
    ...txUsers.map((r) => r.userId),
  ]);

  // Fetch aggregates for all users in parallel
  const users = await Promise.all(
    [...allIds].map(async (userId) => {
      const [profile, eventAgg, deviceAgg, creditAgg] = await Promise.all([
        db(c)
          .select({ answers: userProfiles.answers, notes: userProfiles.notes })
          .from(userProfiles)
          .where(eq(userProfiles.userId, userId))
          .get(),
        db(c)
          .select({
            count: sql<number>`count(*)`,
            firstSeen: sql<string>`min(${activityEvents.createdAt})`,
            lastActive: sql<string>`max(${activityEvents.createdAt})`,
          })
          .from(activityEvents)
          .where(eq(activityEvents.customerId, userId))
          .get(),
        db(c)
          .select({
            count: sql<number>`count(*)`,
            platforms: sql<string>`group_concat(distinct ${pushTokens.platform})`,
          })
          .from(pushTokens)
          .where(eq(pushTokens.userId, userId))
          .get(),
        db(c)
          .select({
            totalSpent: sql<number>`coalesce(sum(case when ${creditTransactions.amount} < 0 then abs(${creditTransactions.amount}) else 0 end), 0)`,
          })
          .from(creditTransactions)
          .where(
            and(
              eq(creditTransactions.customerId, userId),
              eq(creditTransactions.status, "completed"),
            ),
          )
          .get(),
      ]);

      const answers = (profile?.answers ?? {}) as Record<string, unknown>;

      return {
        id: userId,
        country: answers.country ?? answers.initial_country ?? null,
        notes: profile?.notes ?? "",
        devices: deviceAgg?.count ?? 0,
        platforms: deviceAgg?.platforms ?? "",
        events: eventAgg?.count ?? 0,
        creditsSpent: creditAgg?.totalSpent ?? 0,
        firstSeen: eventAgg?.firstSeen ?? null,
        lastActive: eventAgg?.lastActive ?? null,
      };
    }),
  );

  // Sort by last active descending
  users.sort((a, b) => {
    if (!a.lastActive) return 1;
    if (!b.lastActive) return -1;
    return b.lastActive.localeCompare(a.lastActive);
  });

  return c.json(users);
});

/** Get full user detail */
app.get("/:id", async (c) => {
  const userId = c.req.param("id");

  const [profile, events, transactions, devices, completions, backups] =
    await Promise.all([
      db(c)
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .get(),
      db(c)
        .select()
        .from(activityEvents)
        .where(eq(activityEvents.customerId, userId))
        .orderBy(desc(activityEvents.createdAt))
        .limit(100)
        .all(),
      db(c)
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.customerId, userId))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(100)
        .all(),
      db(c)
        .select()
        .from(pushTokens)
        .where(eq(pushTokens.userId, userId))
        .all(),
      db(c)
        .select({
          id: activityCompletions.id,
          ruleId: activityCompletions.ruleId,
          completedAt: activityCompletions.completedAt,
          ruleName: activityRules.name,
          eventType: activityRules.eventType,
          actionType: activityRules.actionType,
        })
        .from(activityCompletions)
        .leftJoin(
          activityRules,
          eq(activityCompletions.ruleId, activityRules.id),
        )
        .where(eq(activityCompletions.customerId, userId))
        .all(),
      db(c)
        .select()
        .from(backupSnapshots)
        .where(eq(backupSnapshots.userId, userId))
        .orderBy(desc(backupSnapshots.createdAt))
        .all(),
    ]);

  return c.json({
    id: userId,
    profile: profile
      ? { answers: profile.answers, notes: profile.notes ?? "", createdAt: profile.createdAt }
      : null,
    events,
    transactions,
    devices,
    completions,
    backups,
  });
});

/** Delete entire user across all tables */
app.delete("/:id", async (c) => {
  const userId = c.req.param("id");

  await Promise.all([
    db(c).delete(userProfiles).where(eq(userProfiles.userId, userId)),
    db(c).delete(activityEvents).where(eq(activityEvents.customerId, userId)),
    db(c).delete(creditTransactions).where(eq(creditTransactions.customerId, userId)),
    db(c).delete(pushTokens).where(eq(pushTokens.userId, userId)),
    db(c).delete(activityCompletions).where(eq(activityCompletions.customerId, userId)),
    db(c).delete(backupSnapshots).where(eq(backupSnapshots.userId, userId)),
  ]);

  return c.json({ success: true, userId });
});

/** Reset a specific data category for a user */
app.delete("/:id/:category", async (c) => {
  const userId = c.req.param("id");
  const category = c.req.param("category");

  const tableMap: Record<string, () => Promise<void>> = {
    profile: () =>
      db(c).delete(userProfiles).where(eq(userProfiles.userId, userId)).then(),
    activity: () =>
      db(c)
        .delete(activityEvents)
        .where(eq(activityEvents.customerId, userId))
        .then(),
    credits: () =>
      db(c)
        .delete(creditTransactions)
        .where(eq(creditTransactions.customerId, userId))
        .then(),
    devices: () =>
      db(c).delete(pushTokens).where(eq(pushTokens.userId, userId)).then(),
    completions: () =>
      db(c)
        .delete(activityCompletions)
        .where(eq(activityCompletions.customerId, userId))
        .then(),
    backups: () =>
      db(c)
        .delete(backupSnapshots)
        .where(eq(backupSnapshots.userId, userId))
        .then(),
  };

  const handler = tableMap[category];
  if (!handler) {
    return c.json({ error: "invalid_category", valid: Object.keys(tableMap) }, 400);
  }

  await handler();
  return c.json({ success: true, category, userId });
});

/** Update admin notes for a user */
app.patch("/:id/notes", async (c) => {
  const userId = c.req.param("id");
  const { notes } = await c.req.json<{ notes: string }>();

  const existing = await db(c)
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .get();

  if (existing) {
    await db(c)
      .update(userProfiles)
      .set({ notes: notes ?? "", updatedAt: new Date().toISOString() })
      .where(eq(userProfiles.userId, userId));
  } else {
    await db(c)
      .insert(userProfiles)
      .values({ userId, notes: notes ?? "" });
  }

  return c.json({ success: true });
});

// ─── Dev-only test action queue (in-memory, ephemeral) ──────

type PendingAction = {
  actionType: string;
  payload: Record<string, unknown>;
  createdAt: number;
};

const pendingActions = new Map<string, PendingAction[]>();

/** Admin pushes a test action directly to a user's device */
app.post("/:id/test-action", async (c) => {
  const userId = c.req.param("id");
  const body = await c.req.json<{
    actionType: string;
    payload?: Record<string, unknown>;
  }>();

  if (!body.actionType) {
    return c.json({ error: "missing_action_type" }, 400);
  }

  const queue = pendingActions.get(userId) ?? [];
  queue.push({
    actionType: body.actionType,
    payload: body.payload ?? {},
    createdAt: Date.now(),
  });
  pendingActions.set(userId, queue);

  return c.json({ success: true, queued: queue.length });
});

/** Mobile polls for pending test actions (returns and clears) */
export function mountTestActionPoll(parentApp: typeof app) {
  parentApp.get("/test-actions/pending", async (c) => {
    const userId = c.get("userId");
    const queue = pendingActions.get(userId) ?? [];
    pendingActions.delete(userId);
    const fresh = queue.filter((e) => Date.now() - e.createdAt < 60_000);
    return c.json({ actions: fresh });
  });
}

export default app;
