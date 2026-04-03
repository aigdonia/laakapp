import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import {
  userProfiles,
  activityEvents,
  activityCompletions,
  creditTransactions,
  pushTokens,
  backupSnapshots,
} from "../db/schema";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const RC_BASE = "https://api.revenuecat.com/v2";

const app = new Hono<Env>();

/** Delete all server-side data for the authenticated user */
app.delete("/", async (c) => {
  const userId = c.get("userId");

  // 1. Delete all D1 records
  await Promise.all([
    db(c).delete(userProfiles).where(eq(userProfiles.userId, userId)),
    db(c).delete(pushTokens).where(eq(pushTokens.userId, userId)),
    db(c)
      .delete(creditTransactions)
      .where(eq(creditTransactions.customerId, userId)),
    db(c)
      .delete(activityEvents)
      .where(eq(activityEvents.customerId, userId)),
    db(c)
      .delete(activityCompletions)
      .where(eq(activityCompletions.customerId, userId)),
    db(c).delete(backupSnapshots).where(eq(backupSnapshots.userId, userId)),
  ]);

  // 2. Delete R2 backup (best-effort)
  try {
    await c.env.BACKUP_BUCKET.delete(`backups/${userId}/latest.json`);
  } catch (e) {
    console.error(`[account] R2 delete failed for ${userId}:`, e);
  }

  // 3. Delete RevenueCat customer (best-effort)
  try {
    const { RC_SECRET_KEY, RC_PROJECT_ID } = c.env;
    if (RC_SECRET_KEY && RC_PROJECT_ID) {
      await fetch(
        `${RC_BASE}/projects/${RC_PROJECT_ID}/customers/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${RC_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (e) {
    console.error(`[account] RC customer delete failed for ${userId}:`, e);
  }

  return c.json({ success: true });
});

export default app;
