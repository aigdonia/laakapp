import { Hono } from "hono";
import { desc, eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { backupSnapshots } from "../db/schema";

const MAX_BACKUP_SIZE = 10 * 1024 * 1024; // 10 MB

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

function r2Key(userId: string) {
  return `backups/${userId}/latest.json`;
}

const app = new Hono<Env>();

// ─── Check backup metadata ──────────────────────────────────
app.get("/", async (c) => {
  const userId = c.get("userId");

  const [snapshot] = await db(c)
    .select()
    .from(backupSnapshots)
    .where(eq(backupSnapshots.userId, userId))
    .orderBy(desc(backupSnapshots.createdAt))
    .limit(1);

  if (!snapshot) {
    return c.json({ exists: false, snapshot: null });
  }

  return c.json({
    exists: true,
    snapshot: {
      transactionCount: snapshot.transactionCount,
      sizeBytes: snapshot.sizeBytes,
      schemaVersion: snapshot.schemaVersion,
      createdAt: snapshot.createdAt,
    },
  });
});

// ─── Create / update backup ─────────────────────────────────
app.post("/", async (c) => {
  const userId = c.get("userId");

  const body = await c.req.json<{
    schemaVersion: number;
    transactions: unknown[];
  }>();

  if (!body.transactions || !Array.isArray(body.transactions)) {
    return c.json({ error: "invalid_payload" }, 400);
  }

  if (!body.schemaVersion || typeof body.schemaVersion !== "number") {
    return c.json({ error: "missing_schema_version" }, 400);
  }

  const payload = JSON.stringify({
    schemaVersion: body.schemaVersion,
    exportedAt: new Date().toISOString(),
    transactions: body.transactions,
  });

  if (payload.length > MAX_BACKUP_SIZE) {
    return c.json({ error: "payload_too_large", maxBytes: MAX_BACKUP_SIZE }, 413);
  }

  // Upload to R2
  await c.env.BACKUP_BUCKET.put(r2Key(userId), payload, {
    httpMetadata: { contentType: "application/json" },
  });

  // Record metadata in D1
  const snapshot = {
    userId,
    transactionCount: body.transactions.length,
    sizeBytes: payload.length,
    schemaVersion: body.schemaVersion,
  };

  await db(c).insert(backupSnapshots).values(snapshot);

  return c.json({
    ok: true,
    transactionCount: snapshot.transactionCount,
    sizeBytes: snapshot.sizeBytes,
  });
});

// ─── Restore from backup ────────────────────────────────────
app.post("/restore", async (c) => {
  const userId = c.get("userId");

  const object = await c.env.BACKUP_BUCKET.get(r2Key(userId));
  if (!object) {
    return c.json({ error: "no_backup" }, 404);
  }

  const data = await object.json<{
    schemaVersion: number;
    exportedAt: string;
    transactions: unknown[];
  }>();

  return c.json({
    schemaVersion: data.schemaVersion,
    exportedAt: data.exportedAt,
    transactionCount: data.transactions.length,
    transactions: data.transactions,
  });
});

export default app;
