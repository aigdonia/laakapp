import { Hono } from "hono";
import { z } from "zod";
import { eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { userProfiles, countries } from "../db/schema";

const profileSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

/** Upsert user profile (onboarding answers) and return derived preferences */
app.post("/", async (c) => {
  const userId = c.get("userId");
  const raw = await c.req.json();
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const body = parsed.data;

  // Upsert profile
  const existing = await db(c)
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .get();

  if (existing) {
    await db(c)
      .update(userProfiles)
      .set({ answers: body.answers as Record<string, string | string[]>, updatedAt: new Date().toISOString() })
      .where(eq(userProfiles.userId, userId));
  } else {
    await db(c)
      .insert(userProfiles)
      .values({ userId, answers: body.answers as Record<string, string | string[]> });
  }

  // Derive preferences from known answer slugs
  const preferences: Record<string, string> = {};

  const countryAnswer = body.answers.country ?? body.answers.initial_country;
  if (typeof countryAnswer === "string" && countryAnswer && countryAnswer !== "OTHER") {
    const country = await db(c)
      .select({ code: countries.code, currency: countries.currency })
      .from(countries)
      .where(eq(countries.code, countryAnswer))
      .get();

    if (country) {
      preferences.countryCode = country.code;
      preferences.baseCurrency = country.currency;
    }
  } else if (countryAnswer === "OTHER") {
    preferences.countryCode = "GLO";
    preferences.baseCurrency = "USD";
  }

  const styleAnswer = body.answers.investment_style;
  if (typeof styleAnswer === "string" && styleAnswer) {
    preferences.portfolioPresetSlug = styleAnswer;
  }

  const frequencyAnswer = body.answers.check_frequency;
  if (typeof frequencyAnswer === "string" && frequencyAnswer) {
    preferences.activityRhythm = frequencyAnswer;
  }

  return c.json({ preferences });
});

/** Patch specific answers (merge into existing) */
app.patch("/", async (c) => {
  const userId = c.get("userId");
  const raw = await c.req.json();
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const body = parsed.data;

  const existing = await db(c)
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .get();

  const merged = {
    ...(existing?.answers as Record<string, string | string[]> ?? {}),
    ...body.answers,
  };

  if (existing) {
    await db(c)
      .update(userProfiles)
      .set({ answers: merged, updatedAt: new Date().toISOString() })
      .where(eq(userProfiles.userId, userId));
  } else {
    await db(c)
      .insert(userProfiles)
      .values({ userId, answers: merged });
  }

  return c.json({ ok: true });
});

/** Get current user profile */
app.get("/", async (c) => {
  const userId = c.get("userId");

  const profile = await db(c)
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .get();

  if (!profile) return c.json({ answers: {} });

  return c.json({ answers: profile.answers });
});

export default app;
