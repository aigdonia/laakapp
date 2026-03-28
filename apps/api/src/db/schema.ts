import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import type { FieldConfig } from "@fin-ai/shared";

const timestamps = {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
};

// ─── Countries ───────────────────────────────────────────────
export const countries = sqliteTable("countries", {
  ...timestamps,
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  currency: text("currency").notNull(),
  flagEmoji: text("flag_emoji").notNull().default(""),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Stocks ──────────────────────────────────────────────────
export const stocks = sqliteTable("stocks", {
  ...timestamps,
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  countryCode: text("country_code").notNull(),
  exchange: text("exchange").notNull(),
  sector: text("sector").notNull().default(""),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Screening Rules ────────────────────────────────────────
export const screeningRules = sqliteTable("screening_rules", {
  ...timestamps,
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  methodology: text("methodology").notNull(),
  description: text("description").notNull().default(""),
  thresholds: text("thresholds", { mode: "json" })
    .notNull()
    .$type<Record<string, number>>()
    .default({}),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Article Categories ─────────────────────────────────────
export const articleCategories = sqliteTable("article_categories", {
  ...timestamps,
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull().default("📄"),
  order: integer("order").notNull().default(0),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Articles ────────────────────────────────────────────────
export const articles = sqliteTable("articles", {
  ...timestamps,
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  languageCode: text("language_code").notNull(),
  status: text("status", { enum: ["draft", "published", "archived"] })
    .notNull()
    .default("draft"),
  publishedAt: text("published_at"),
  categoryId: text("category_id"),
});

// ─── Micro Lessons ───────────────────────────────────────────
export const microLessons = sqliteTable("micro_lessons", {
  ...timestamps,
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull().default(""),
  concept: text("concept").notNull().default(""),
  languageCode: text("language_code").notNull(),
  order: integer("order").notNull().default(0),
});

// ─── Learning Cards ──────────────────────────────────────────
export const learningCards = sqliteTable("learning_cards", {
  ...timestamps,
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  trigger: text("trigger").notNull().default(""),
  condition: text("condition").notNull().default(""),
  order: integer("order").notNull().default(0),
  languageCode: text("language_code").notNull(),
});

// ─── Languages ───────────────────────────────────────────────
export const languages = sqliteTable("languages", {
  ...timestamps,
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  direction: text("direction", { enum: ["ltr", "rtl"] })
    .notNull()
    .default("ltr"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
});

// ─── Credit Packages ─────────────────────────────────────────
export const creditPackages = sqliteTable("credit_packages", {
  ...timestamps,
  name: text("name").notNull(),
  credits: integer("credits").notNull(),
  priceUsd: real("price_usd").notNull(),
  region: text("region").notNull().default(""),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  order: integer("order").notNull().default(0),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Affiliates ──────────────────────────────────────────────
export const affiliates = sqliteTable("affiliates", {
  ...timestamps,
  name: text("name").notNull(),
  url: text("url").notNull(),
  code: text("code").notNull().unique(),
  commissionPercent: real("commission_percent").notNull(),
  category: text("category").notNull().default(""),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Prompts ─────────────────────────────────────────────────
export const prompts = sqliteTable("prompts", {
  ...timestamps,
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  systemPrompt: text("system_prompt").notNull().default(""),
  model: text("model").notNull().default(""),
  temperature: real("temperature").notNull().default(0.7),
  maxTokens: integer("max_tokens").notNull().default(1024),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Lookups ────────────────────────────────────────────────
export const lookups = sqliteTable("lookups", {
  ...timestamps,
  category: text("category").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  metadata: text("metadata", { mode: "json" })
    .$type<Record<string, string>>()
    .notNull()
    .default({}),
  order: integer("order").notNull().default(0),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Asset Classes ───────────────────────────────────────────
export const assetClasses = sqliteTable("asset_classes", {
  ...timestamps,
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull().default(""),
  color: text("color").notNull().default("#6b7280"),
  order: integer("order").notNull().default(0),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  fields: text("fields", { mode: "json" })
    .notNull()
    .$type<FieldConfig[]>()
    .default([]),
  aggregationKeys: text("aggregation_keys", { mode: "json" })
    .notNull()
    .$type<string[]>()
    .default([]),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Portfolio Presets ──────────────────────────────────────
export const portfolioPresets = sqliteTable("portfolio_presets", {
  ...timestamps,
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  order: integer("order").notNull().default(0),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  allocations: text("allocations", { mode: "json" })
    .notNull()
    .$type<Record<string, number>>()
    .default({}),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── UI Translations ────────────────────────────────────────
export const uiTranslations = sqliteTable("ui_translations", {
  ...timestamps,
  key: text("key").notNull(),
  namespace: text("namespace").notNull().default("common"),
  languageCode: text("language_code").notNull(),
  value: text("value").notNull(),
});

// ─── Translation Bundle Versions (cache invalidation) ───────
export const translationBundleVersions = sqliteTable(
  "translation_bundle_versions",
  {
    ...timestamps,
    languageCode: text("language_code").notNull().unique(),
    version: integer("version").notNull().default(1),
  }
);

// ─── Credit Transactions ────────────────────────────────────
export const creditTransactions = sqliteTable("credit_transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  customerId: text("customer_id").notNull(),
  feature: text("feature").notNull(),
  amount: integer("amount").notNull(),
  balanceAfter: integer("balance_after"),
  status: text("status", { enum: ["completed", "refunded", "failed"] })
    .notNull()
    .default("completed"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// ─── Onboarding Screens ─────────────────────────────────────
export const onboardingScreens = sqliteTable("onboarding_screens", {
  ...timestamps,
  type: text("type").notNull().default("informative"),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull().default(""),
  choices: text("choices", { mode: "json" })
    .notNull()
    .$type<Array<{ value: string }>>()
    .default([]),
  order: integer("order").notNull().default(0),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  translations: text("translations", { mode: "json" })
    .notNull()
    .$type<Record<string, Record<string, string>>>()
    .default({}),
});

// ─── Push Tokens ────────────────────────────────────────────
export const pushTokens = sqliteTable("push_tokens", {
  ...timestamps,
  userId: text("user_id").notNull(),
  expoToken: text("expo_token").notNull().unique(),
  platform: text("platform", { enum: ["ios", "android"] }).notNull(),
  prefs: text("prefs", { mode: "json" })
    .notNull()
    .$type<{ marketing: boolean; content: boolean; onboarding: boolean }>()
    .default({ marketing: true, content: true, onboarding: true }),
});

// ─── Notifications (campaigns) ──────────────────────────────
export const notifications = sqliteTable("notifications", {
  ...timestamps,
  title: text("title").notNull(),
  body: text("body").notNull(),
  category: text("category", {
    enum: ["marketing", "content", "onboarding"],
  }).notNull(),
  deepLink: text("deep_link"),
  target: text("target", { enum: ["all", "ios", "android"] })
    .notNull()
    .default("all"),
  scheduledAt: text("scheduled_at"),
  sentAt: text("sent_at"),
  status: text("status", {
    enum: ["draft", "scheduled", "sent", "failed"],
  })
    .notNull()
    .default("draft"),
});

// ─── Notification Logs ──────────────────────────────────────
export const notificationLogs = sqliteTable("notification_logs", {
  ...timestamps,
  notificationId: text("notification_id").notNull(),
  expoToken: text("expo_token").notNull(),
  status: text("status", {
    enum: ["sent", "error", "device_not_registered"],
  }).notNull(),
  errorMessage: text("error_message"),
});

// ─── Exchange Rates ─────────────────────────────────────────
export const exchangeRates = sqliteTable("exchange_rates", {
  ...timestamps,
  currency: text("currency").notNull().unique(),
  ratePerUsd: real("rate_per_usd").notNull(),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
});

// ─── App Settings (singleton) ────────────────────────────────
export const appSettings = sqliteTable("app_settings", {
  ...timestamps,
  maintenanceMode: integer("maintenance_mode", { mode: "boolean" })
    .notNull()
    .default(false),
  defaultLanguage: text("default_language").notNull().default("en"),
  onboardingEnabled: integer("onboarding_enabled", { mode: "boolean" })
    .notNull()
    .default(true),
  baseCurrency: text("base_currency").notNull().default("USD"),
});
