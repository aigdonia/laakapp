import { Hono } from "hono";
import { z } from "zod";
import { eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { pushTokens } from "../db/schema";

const prefsSchema = z.object({
  marketing: z.boolean(),
  content: z.boolean(),
  onboarding: z.boolean(),
});

const registerSchema = z.object({
  expoToken: z.string().min(1),
  platform: z.enum(["ios", "android"]),
  prefs: prefsSchema.optional(),
});

const updatePrefsSchema = z.object({
  expoToken: z.string().min(1),
  prefs: prefsSchema,
});

const deleteSchema = z.object({
  expoToken: z.string().min(1),
});

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

/** Register or update a push token */
app.post("/", async (c) => {
  const userId = c.get("userId");
  const raw = await c.req.json();
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const body = parsed.data;

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
        userId,
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
      userId,
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
  const raw = await c.req.json();
  const parsed = updatePrefsSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const body = parsed.data;

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
  const raw = await c.req.json();
  const parsed = deleteSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const body = parsed.data;
  await db(c)
    .delete(pushTokens)
    .where(eq(pushTokens.expoToken, body.expoToken));
  return c.json({ success: true });
});

export default app;
