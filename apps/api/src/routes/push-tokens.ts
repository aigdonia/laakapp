import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { pushTokens } from "../db/schema";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db" as never) as Database;
}

const app = new Hono<Env>();

/** Register or update a push token */
app.post("/", async (c) => {
  const body = await c.req.json<{
    userId: string;
    expoToken: string;
    platform: "ios" | "android";
    prefs?: { marketing: boolean; content: boolean; onboarding: boolean };
  }>();

  if (!body.userId || !body.expoToken || !body.platform) {
    return c.json({ error: "missing_fields" }, 400);
  }

  // Upsert: update if token exists, insert otherwise
  const existing = await db(c)
    .select()
    .from(pushTokens)
    .where(eq(pushTokens.expoToken, body.expoToken))
    .get();

  if (existing) {
    const row = await db(c)
      .update(pushTokens)
      .set({
        userId: body.userId,
        platform: body.platform,
        ...(body.prefs && { prefs: body.prefs }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(pushTokens.expoToken, body.expoToken))
      .returning()
      .get();
    return c.json(row);
  }

  const row = await db(c)
    .insert(pushTokens)
    .values({
      userId: body.userId,
      expoToken: body.expoToken,
      platform: body.platform,
      ...(body.prefs && { prefs: body.prefs }),
    })
    .returning()
    .get();

  return c.json(row, 201);
});

/** Update notification preferences for a token */
app.put("/prefs", async (c) => {
  const body = await c.req.json<{
    expoToken: string;
    prefs: { marketing: boolean; content: boolean; onboarding: boolean };
  }>();

  const row = await db(c)
    .update(pushTokens)
    .set({ prefs: body.prefs, updatedAt: new Date().toISOString() })
    .where(eq(pushTokens.expoToken, body.expoToken))
    .returning()
    .get();

  if (!row) return c.json({ error: "token_not_found" }, 404);
  return c.json(row);
});

/** Unregister a push token */
app.delete("/", async (c) => {
  const body = await c.req.json<{ expoToken: string }>();
  await db(c)
    .delete(pushTokens)
    .where(eq(pushTokens.expoToken, body.expoToken));
  return c.json({ success: true });
});

export default app;
