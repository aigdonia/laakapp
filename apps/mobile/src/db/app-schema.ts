import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core'

export const cachedPrices = sqliteTable('cached_prices', {
  symbol: text('symbol').primaryKey(),
  price: real('price').notNull(),
  change: real('change'),
  changePercent: real('change_percent'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedMicroLessons = sqliteTable('cached_micro_lessons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  content: text('content').notNull(),
  concept: text('concept').notNull(),
  languageCode: text('language_code').notNull(),
  order: integer('order').notNull().default(0),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedArticleCategories = sqliteTable('cached_article_categories', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  icon: text('icon').notNull(),
  order: integer('order').notNull().default(0),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  translations: text('translations').notNull().default('{}'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedArticles = sqliteTable('cached_articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  summary: text('summary').notNull(),
  body: text('body').notNull(),
  languageCode: text('language_code').notNull(),
  status: text('status').notNull(),
  publishedAt: text('published_at'),
  categoryId: text('category_id'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedStocks = sqliteTable('cached_stocks', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull(),
  name: text('name').notNull(),
  exchange: text('exchange').notNull(),
  countryCode: text('country_code').notNull(),
  sector: text('sector').notNull(),
  lastPrice: real('last_price'),
  lastPriceUpdatedAt: text('last_price_updated_at'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedAssetClasses = sqliteTable('cached_asset_classes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  order: integer('order').notNull().default(0),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  fields: text('fields').notNull().default('[]'),
  aggregationKeys: text('aggregation_keys').notNull().default('[]'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedLookups = sqliteTable('cached_lookups', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  label: text('label').notNull(),
  value: text('value').notNull(),
  metadata: text('metadata').notNull().default('{}'),
  order: integer('order').notNull().default(0),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedLanguages = sqliteTable('cached_languages', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  nativeName: text('native_name').notNull(),
  direction: text('direction').notNull().default('ltr'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedTranslationBundles = sqliteTable('cached_translation_bundles', {
  languageCode: text('language_code').primaryKey(),
  version: integer('version').notNull(),
  bundle: text('bundle').notNull().default('{}'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedOnboardingScreens = sqliteTable('cached_onboarding_screens', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  slug: text('slug').notNull(),
  imageUrl: text('image_url').notNull().default(''),
  choices: text('choices').notNull().default('[]'),
  order: integer('order').notNull().default(0),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  translations: text('translations').notNull().default('{}'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedLearningCards = sqliteTable('cached_learning_cards', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  trigger: text('trigger').notNull(),
  condition: text('condition').notNull(),
  order: integer('order').notNull().default(0),
  languageCode: text('language_code').notNull(),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedExchangeRates = sqliteTable('cached_exchange_rates', {
  currency: text('currency').primaryKey(),
  ratePerUsd: real('rate_per_usd').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedCountries = sqliteTable('cached_countries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  currency: text('currency').notNull(),
  flagEmoji: text('flag_emoji').notNull().default(''),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  translations: text('translations').notNull().default('{}'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const cachedPortfolioPresets = sqliteTable('cached_portfolio_presets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description').notNull().default(''),
  order: integer('order').notNull().default(0),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  allocations: text('allocations').notNull().default('{}'),
  translations: text('translations').notNull().default('{}'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})
