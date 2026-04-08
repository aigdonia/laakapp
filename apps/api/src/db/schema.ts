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
  about: text("about"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  lastPrice: real("last_price"),
  lastPriceUpdatedAt: text("last_price_updated_at"),
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
  coverImage: text("cover_image"),
  author: text("author"),
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
  imageUrl: text("image_url").notNull().default(""),
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
  skippable: integer("skippable", { mode: "boolean" }).notNull().default(true),
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

// ─── Stock Compliance ──────────────────────────────────────
export const stockCompliance = sqliteTable("stock_compliance", {
  ...timestamps,
  stockId: text("stock_id").notNull(),
  screeningRuleId: text("screening_rule_id").notNull(),
  status: text("status", {
    enum: ["compliant", "non_compliant", "doubtful", "not_screened"],
  })
    .notNull()
    .default("not_screened"),
  layer: text("layer", {
    enum: ["sector", "index", "financial", "manual"],
  }).notNull(),
  debtRatio: real("debt_ratio"),
  cashInterestRatio: real("cash_interest_ratio"),
  receivablesRatio: real("receivables_ratio"),
  nonPermissibleIncomeRatio: real("non_permissible_income_ratio"),
  source: text("source", { enum: ["auto", "manual_override"] })
    .notNull()
    .default("auto"),
  notes: text("notes").notNull().default(""),
  validFrom: text("valid_from").notNull(),
  validUntil: text("valid_until"),
});

// ─── Stock Financials ──────────────────────────────────────
export const stockFinancials = sqliteTable("stock_financials", {
  ...timestamps,
  stockId: text("stock_id").notNull(),
  fiscalYear: integer("fiscal_year").notNull(),
  fiscalPeriod: text("fiscal_period", {
    enum: ["annual", "q1", "q2", "q3", "q4"],
  }).notNull(),
  source: text("source", {
    enum: ["stockanalysis", "mubasher", "manual"],
  }).notNull(),
  totalAssets: real("total_assets"),
  totalDebt: real("total_debt"),
  cashAndEquivalents: real("cash_and_equivalents"),
  interestBearingDeposits: real("interest_bearing_deposits"),
  receivables: real("receivables"),
  marketCap: real("market_cap"),
  totalRevenue: real("total_revenue"),
  nonPermissibleRevenue: real("non_permissible_revenue"),
  rawData: text("raw_data", { mode: "json" })
    .$type<Record<string, unknown>>()
    .default({}),
  fetchedAt: text("fetched_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// ─── Data Source Param Schema ──────────────────────────────
export interface DataSourceParam {
  key: string;
  label: string;
  type: "string" | "number" | "enum";
  required: boolean;
  options?: Record<string, string>; // For enum: { displayLabel: actualValue }
}

// ─── Data Sources ──────────────────────────────────────────
export const dataSources = sqliteTable("data_sources", {
  ...timestamps,
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  urlTemplate: text("url_template").notNull().default(""),
  params: text("params", { mode: "json" })
    .notNull()
    .$type<DataSourceParam[]>()
    .default([]),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
});

// ─── Scrape Jobs ───────────────────────────────────────────
export const scrapeJobs = sqliteTable("scrape_jobs", {
  ...timestamps,
  dataSourceId: text("data_source_id").notNull(),
  params: text("params", { mode: "json" })
    .notNull()
    .$type<Record<string, string | number | null>>()
    .default({}),
  schedule: text("schedule"), // e.g. "every 24h", null = one-time
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
});

// ─── Scrape Executions ────────────────────────────────────
export const scrapeExecutions = sqliteTable("scrape_executions", {
  ...timestamps,
  jobId: text("job_id").notNull(),
  status: text("status", {
    enum: ["pending", "running", "completed", "failed"],
  })
    .notNull()
    .default("pending"),
  progress: text("progress", { mode: "json" })
    .notNull()
    .$type<{ total: number; completed: number; failed: number; errors: string[] }>()
    .default({ total: 0, completed: 0, failed: 0, errors: [] }),
  startedAt: text("started_at"),
  completedAt: text("completed_at"),
  errorMessage: text("error_message"),
  logKey: text("log_key"),
  trigger: text("trigger", { enum: ["manual", "cron", "retry"] })
    .notNull()
    .default("manual"),
});

// ─── Event Types (activity registry) ────────────────────────
export const eventTypes = sqliteTable("event_types", {
  ...timestamps,
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  description: text("description").notNull().default(""),
  metadataSchema: text("metadata_schema", { mode: "json" })
    .notNull()
    .$type<Array<{ key: string; label: string; type: "string" | "number" | "boolean" }>>()
    .default([]),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
});

// ─── Activity Rules ─────────────────────────────────────────
export const activityRules = sqliteTable("activity_rules", {
  ...timestamps,
  name: text("name").notNull(),
  eventType: text("event_type").notNull(),
  threshold: integer("threshold").notNull().default(1),
  actionType: text("action_type", {
    enum: [
      "reward_credits",
      "show_micro_lesson",
      "show_learning_card",
      "show_toast",
      "show_confetti",
      "unlock_feature",
    ],
  }).notNull(),
  actionPayload: text("action_payload", { mode: "json" })
    .notNull()
    .$type<Record<string, unknown>>()
    .default({}),
  conditions: text("conditions", { mode: "json" })
    .notNull()
    .$type<Record<string, unknown>>()
    .default({}),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  order: integer("order").notNull().default(0),
});

// ─── Activity Events (append-only log) ──────────────────────
export const activityEvents = sqliteTable("activity_events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  customerId: text("customer_id").notNull(),
  eventType: text("event_type").notNull(),
  metadata: text("metadata", { mode: "json" })
    .$type<Record<string, unknown>>()
    .default({}),
  idempotencyKey: text("idempotency_key"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// ─── Activity Completions (prevents double-firing) ──────────
export const activityCompletions = sqliteTable("activity_completions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  customerId: text("customer_id").notNull(),
  ruleId: text("rule_id").notNull(),
  completedAt: text("completed_at")
    .notNull()
    .default(sql`(current_timestamp)`),
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
  minAppVersion: text("min_app_version").notNull().default("0.0.0"),
});

// ─── Stock Analyses (batch-generated AI deep-dives) ────────
export const stockAnalyses = sqliteTable("stock_analyses", {
  ...timestamps,
  stockId: text("stock_id").notNull(),
  languageCode: text("language_code").notNull().default("en"),
  content: text("content").notNull(),
  model: text("model").notNull(),
  version: integer("version").notNull().default(1),
  triggerReason: text("trigger_reason"),
});

// ─── AI Features (credit-gated feature config) ─────────────
export const aiFeatures = sqliteTable("ai_features", {
  ...timestamps,
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  creditCost: integer("credit_cost").notNull().default(0),
  freeRefresh: integer("free_refresh", { mode: "boolean" }).notNull().default(false),
  promptSlug: text("prompt_slug").notNull(),
  useProfile: integer("use_profile", { mode: "boolean" }).notNull().default(false),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
});

// ─── User Profiles ──────────────────────────────────────────
export const userProfiles = sqliteTable("user_profiles", {
  ...timestamps,
  userId: text("user_id").notNull().unique(),
  answers: text("answers", { mode: "json" })
    .notNull()
    .$type<Record<string, string | string[]>>()
    .default({}),
  notes: text("notes").notNull().default(""),
});

// ─── Backup Snapshots ───────────────────────────────────────
export const backupSnapshots = sqliteTable("backup_snapshots", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  transactionCount: integer("transaction_count").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  schemaVersion: integer("schema_version").notNull().default(1),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});
