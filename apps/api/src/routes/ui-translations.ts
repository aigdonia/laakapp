import { Hono } from "hono";
import { eq, and, sql } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import {
  uiTranslations,
  translationBundleVersions,
} from "../db/schema";
import type { TranslationBundle } from "@fin-ai/shared";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

async function bumpVersion(database: Database, languageCode: string) {
  await database
    .insert(translationBundleVersions)
    .values({ languageCode, version: 1 })
    .onConflictDoUpdate({
      target: translationBundleVersions.languageCode,
      set: {
        version: sql`${translationBundleVersions.version} + 1`,
        updatedAt: sql`current_timestamp`,
      },
    });
}

const app = new Hono<Env>();

// ─── Admin CRUD ─────────────────────────────────────────────

// List all (supports ?namespace= and ?languageCode= filters)
app.get("/", async (c) => {
  const namespace = c.req.query("namespace");
  const languageCode = c.req.query("languageCode");

  const conditions = [];
  if (namespace) conditions.push(eq(uiTranslations.namespace, namespace));
  if (languageCode)
    conditions.push(eq(uiTranslations.languageCode, languageCode));

  const query = db(c).select().from(uiTranslations);
  const rows =
    conditions.length > 0
      ? await query.where(and(...conditions)).all()
      : await query.all();

  return c.json(rows);
});

// Create single translation
app.post("/", async (c) => {
  const body = await c.req.json();
  const row = await db(c)
    .insert(uiTranslations)
    .values(body)
    .returning()
    .get();
  await bumpVersion(db(c), body.languageCode);
  return c.json(row, 201);
});

// Bulk upsert
app.post("/bulk", async (c) => {
  const items = await c.req.json<
    Array<{
      key: string;
      namespace: string;
      languageCode: string;
      value: string;
    }>
  >();

  const results = [];
  const affectedLanguages = new Set<string>();

  for (const item of items) {
    // Try to find existing row
    const existing = await db(c)
      .select()
      .from(uiTranslations)
      .where(
        and(
          eq(uiTranslations.key, item.key),
          eq(uiTranslations.namespace, item.namespace),
          eq(uiTranslations.languageCode, item.languageCode)
        )
      )
      .get();

    if (existing) {
      const updated = await db(c)
        .update(uiTranslations)
        .set({ value: item.value, updatedAt: new Date().toISOString() })
        .where(eq(uiTranslations.id, existing.id))
        .returning()
        .get();
      results.push(updated);
    } else {
      const created = await db(c)
        .insert(uiTranslations)
        .values(item)
        .returning()
        .get();
      results.push(created);
    }
    affectedLanguages.add(item.languageCode);
  }

  // Bump version for all affected languages
  for (const lang of affectedLanguages) {
    await bumpVersion(db(c), lang);
  }

  return c.json(results, 201);
});

// Update single translation
app.put("/:id", async (c) => {
  const body = await c.req.json();
  const row = await db(c)
    .update(uiTranslations)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(uiTranslations.id, c.req.param("id")))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  await bumpVersion(db(c), row.languageCode);
  return c.json(row);
});

// Delete single translation
app.delete("/:id", async (c) => {
  const row = await db(c)
    .select()
    .from(uiTranslations)
    .where(eq(uiTranslations.id, c.req.param("id")))
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  await db(c)
    .delete(uiTranslations)
    .where(eq(uiTranslations.id, c.req.param("id")));
  await bumpVersion(db(c), row.languageCode);
  return c.json({ success: true });
});

// ─── Mobile-facing endpoints ────────────────────────────────

// Version map for cache invalidation
app.get("/versions", async (c) => {
  const rows = await db(c).select().from(translationBundleVersions).all();
  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.languageCode] = row.version;
  }
  return c.json(map);
});

// Full bundle for a language (nested by namespace for i18next)
app.get("/bundle/:languageCode", async (c) => {
  const languageCode = c.req.param("languageCode");

  const rows = await db(c)
    .select()
    .from(uiTranslations)
    .where(eq(uiTranslations.languageCode, languageCode))
    .all();

  const bundle: TranslationBundle = {};
  for (const row of rows) {
    if (!bundle[row.namespace]) bundle[row.namespace] = {};
    bundle[row.namespace][row.key] = row.value;
  }

  const versionRow = await db(c)
    .select()
    .from(translationBundleVersions)
    .where(eq(translationBundleVersions.languageCode, languageCode))
    .get();

  return c.json({
    languageCode,
    version: versionRow?.version ?? 0,
    bundle,
  });
});

export default app;
