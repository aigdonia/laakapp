import { Hono } from "hono";
import { z } from "zod";
import { eq, and, sql, isNull, lte } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { notifications, notificationLogs, pushTokens } from "../db/schema";

const createNotificationSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(1000),
  category: z.enum(["marketing", "content", "onboarding"]),
  deepLink: z.string().max(500).optional(),
  target: z.enum(["all", "ios", "android"]).default("all"),
  scheduledAt: z.string().optional(),
});

const updateNotificationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(1).max(1000).optional(),
  category: z.enum(["marketing", "content", "onboarding"]).optional(),
  deepLink: z.string().max(500).nullable().optional(),
  target: z.enum(["all", "ios", "android"]).optional(),
  scheduledAt: z.string().nullable().optional(),
  status: z.enum(["draft", "scheduled"]).optional(),
});
import {
  sendExpoPushNotifications,
  type ExpoPushMessage,
} from "../lib/expo-push";
import type { NotificationCategory } from "@fin-ai/shared";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

/** Allowed deep link path prefixes — must match mobile app routes. */
const ALLOWED_DEEP_LINK_PREFIXES = [
  "/stock/",
  "/holding/",
  "/article/",
  "/category/",
  "/credits",
  "/add-holding",
  "/onboarding",
  "/terms",
  "/privacy",
];

function isValidDeepLink(link: string): boolean {
  // Must be a relative path starting with /
  if (!link.startsWith("/")) return false;
  // Must not contain protocol or double slashes (prevents open redirect)
  if (link.includes("://") || link.includes("//")) return false;
  return ALLOWED_DEEP_LINK_PREFIXES.some((prefix) => link.startsWith(prefix));
}

const app = new Hono<Env>();

/** List all notification campaigns with delivery stats */
app.get("/", async (c) => {
  const rows = await db(c).select().from(notifications).all();

  // Fetch stats for sent notifications
  const withStats = await Promise.all(
    rows.map(async (n) => {
      if (n.status !== "sent") {
        return { ...n, sent: 0, errors: 0, total: 0 };
      }
      const logs = await db(c)
        .select({
          status: notificationLogs.status,
          count: sql<number>`count(*)`,
        })
        .from(notificationLogs)
        .where(eq(notificationLogs.notificationId, n.id))
        .groupBy(notificationLogs.status)
        .all();

      const stats = { sent: 0, errors: 0, total: 0 };
      for (const log of logs) {
        if (log.status === "sent") stats.sent = log.count;
        else stats.errors += log.count;
        stats.total += log.count;
      }
      return { ...n, ...stats };
    })
  );

  return c.json(withStats);
});

/** Get a single notification */
app.get("/:id", async (c) => {
  const row = await db(c)
    .select()
    .from(notifications)
    .where(eq(notifications.id, c.req.param("id")))
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

/** Create a notification campaign */
app.post("/", async (c) => {
  const raw = await c.req.json();
  const parsed = createNotificationSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const body = parsed.data;

  if (body.deepLink && !isValidDeepLink(body.deepLink)) {
    return c.json(
      { error: "invalid_deep_link", message: "Deep link must be a valid app route" },
      400
    );
  }

  const status = body.scheduledAt ? "scheduled" : "draft";

  const row = await db(c)
    .insert(notifications)
    .values({
      title: body.title,
      body: body.body,
      category: body.category,
      deepLink: body.deepLink ?? null,
      target: body.target ?? "all",
      scheduledAt: body.scheduledAt ?? null,
      status,
    })
    .returning()
    .get();

  return c.json(row, 201);
});

/** Update a notification (only if draft/scheduled) */
app.put("/:id", async (c) => {
  const existing = await db(c)
    .select()
    .from(notifications)
    .where(eq(notifications.id, c.req.param("id")))
    .get();

  if (!existing) return c.json({ error: "Not found" }, 404);
  if (existing.status === "sent") {
    return c.json({ error: "cannot_edit_sent" }, 400);
  }

  const raw = await c.req.json();
  const parsed = updateNotificationSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const body = parsed.data;

  if (body.deepLink && !isValidDeepLink(body.deepLink)) {
    return c.json(
      { error: "invalid_deep_link", message: "Deep link must be a valid app route" },
      400
    );
  }

  const row = await db(c)
    .update(notifications)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(notifications.id, c.req.param("id")))
    .returning()
    .get();

  return c.json(row);
});

/** Delete a notification */
app.delete("/:id", async (c) => {
  await db(c)
    .delete(notificationLogs)
    .where(eq(notificationLogs.notificationId, c.req.param("id")));
  await db(c)
    .delete(notifications)
    .where(eq(notifications.id, c.req.param("id")));
  return c.json({ success: true });
});

/** Send a notification immediately */
app.post("/:id/send", async (c) => {
  const notification = await db(c)
    .select()
    .from(notifications)
    .where(eq(notifications.id, c.req.param("id")))
    .get();

  if (!notification) return c.json({ error: "Not found" }, 404);
  if (notification.status === "sent") {
    return c.json({ error: "already_sent" }, 400);
  }

  const result = await sendNotification(db(c), notification);
  return c.json(result);
});

/** Shared send logic — used by both manual send and cron */
export async function sendNotification(
  database: Database,
  notification: typeof notifications.$inferSelect
) {
  // 1. Get target tokens with matching prefs
  const categoryKey = notification.category as keyof {
    marketing: boolean;
    content: boolean;
    onboarding: boolean;
  };

  let tokenQuery = database.select().from(pushTokens);

  // Filter by platform if targeted
  const allTokens =
    notification.target === "all"
      ? await tokenQuery.all()
      : await database
          .select()
          .from(pushTokens)
          .where(eq(pushTokens.platform, notification.target))
          .all();

  // Filter by preference
  const eligibleTokens = allTokens.filter((t) => {
    const prefs = t.prefs as { marketing: boolean; content: boolean; onboarding: boolean };
    return prefs[categoryKey] !== false;
  });

  if (eligibleTokens.length === 0) {
    await database
      .update(notifications)
      .set({ status: "sent", sentAt: new Date().toISOString() })
      .where(eq(notifications.id, notification.id));
    return { sent: 0, errors: 0, total: 0 };
  }

  // 2. Build messages
  const messages: ExpoPushMessage[] = eligibleTokens.map((t) => ({
    to: t.expoToken,
    title: notification.title,
    body: notification.body,
    sound: "default" as const,
    data: {
      notificationId: notification.id,
      category: notification.category,
      ...(notification.deepLink && { deepLink: notification.deepLink }),
    },
  }));

  // 3. Send via Expo Push API
  const tickets = await sendExpoPushNotifications(messages);

  // 4. Log results
  const logEntries = tickets.map((ticket, i) => ({
    notificationId: notification.id,
    expoToken: eligibleTokens[i].expoToken,
    status: ticket.status === "ok" ? ("sent" as const) : ticket.details?.error === "DeviceNotRegistered" ? ("device_not_registered" as const) : ("error" as const),
    errorMessage:
      ticket.status === "error" ? (ticket.message ?? null) : null,
  }));

  if (logEntries.length > 0) {
    await database.insert(notificationLogs).values(logEntries);
  }

  // 5. Clean up unregistered tokens
  const unregistered = logEntries
    .filter((l) => l.status === "device_not_registered")
    .map((l) => l.expoToken);
  for (const token of unregistered) {
    await database
      .delete(pushTokens)
      .where(eq(pushTokens.expoToken, token));
  }

  // 6. Update notification status
  const sent = logEntries.filter((l) => l.status === "sent").length;
  const errors = logEntries.filter((l) => l.status !== "sent").length;

  await database
    .update(notifications)
    .set({
      status: "sent",
      sentAt: new Date().toISOString(),
    })
    .where(eq(notifications.id, notification.id));

  return { sent, errors, total: logEntries.length };
}

/** Process scheduled notifications — called by cron trigger */
export async function processScheduledNotifications(database: Database) {
  const now = new Date().toISOString();
  const due = await database
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.status, "scheduled"),
        lte(notifications.scheduledAt, now)
      )
    )
    .all();

  const results = [];
  for (const notification of due) {
    try {
      const result = await sendNotification(database, notification);
      results.push({ id: notification.id, ...result });
    } catch (error) {
      await database
        .update(notifications)
        .set({ status: "failed" })
        .where(eq(notifications.id, notification.id));
      results.push({
        id: notification.id,
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  return results;
}

export default app;
