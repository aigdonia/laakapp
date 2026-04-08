import { openDatabaseSync } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'

const expoDb = openDatabaseSync('app-data.db')
export const appDb = drizzle(expoDb)

export function initAppDb() {
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS cached_prices (
      symbol TEXT PRIMARY KEY NOT NULL,
      price REAL NOT NULL,
      change REAL,
      change_percent REAL,
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_stocks (
      id TEXT PRIMARY KEY NOT NULL,
      symbol TEXT NOT NULL,
      name TEXT NOT NULL,
      exchange TEXT NOT NULL,
      country_code TEXT NOT NULL,
      sector TEXT NOT NULL,
      last_price REAL,
      last_price_updated_at TEXT,
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_micro_lessons (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT NOT NULL,
      concept TEXT NOT NULL,
      language_code TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_article_categories (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      icon TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      translations TEXT NOT NULL DEFAULT '{}',
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_articles (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      summary TEXT NOT NULL,
      body TEXT NOT NULL,
      language_code TEXT NOT NULL,
      status TEXT NOT NULL,
      published_at TEXT,
      category_id TEXT,
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_asset_classes (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      fields TEXT NOT NULL DEFAULT '[]',
      aggregation_keys TEXT NOT NULL DEFAULT '[]',
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_lookups (
      id TEXT PRIMARY KEY NOT NULL,
      category TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      metadata TEXT NOT NULL DEFAULT '{}',
      "order" INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_languages (
      code TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      native_name TEXT NOT NULL,
      direction TEXT NOT NULL DEFAULT 'ltr',
      enabled INTEGER NOT NULL DEFAULT 1,
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_translation_bundles (
      language_code TEXT PRIMARY KEY NOT NULL,
      version INTEGER NOT NULL,
      bundle TEXT NOT NULL DEFAULT '{}',
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_onboarding_screens (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      slug TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      choices TEXT NOT NULL DEFAULT '[]',
      "order" INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      skippable INTEGER NOT NULL DEFAULT 1,
      translations TEXT NOT NULL DEFAULT '{}',
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_learning_cards (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      trigger TEXT NOT NULL,
      condition TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      language_code TEXT NOT NULL,
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_countries (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      currency TEXT NOT NULL,
      flag_emoji TEXT NOT NULL DEFAULT '',
      enabled INTEGER NOT NULL DEFAULT 1,
      translations TEXT NOT NULL DEFAULT '{}',
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_exchange_rates (
      currency TEXT PRIMARY KEY NOT NULL,
      rate_per_usd REAL NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_screening_rules (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      methodology TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      enabled INTEGER NOT NULL DEFAULT 1,
      thresholds TEXT NOT NULL DEFAULT '{}',
      translations TEXT NOT NULL DEFAULT '{}',
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_stock_compliance (
      symbol TEXT PRIMARY KEY NOT NULL,
      rule_slug TEXT NOT NULL,
      status TEXT NOT NULL,
      layer TEXT NOT NULL,
      ratios TEXT NOT NULL DEFAULT '{}',
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cached_portfolio_presets (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      "order" INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      allocations TEXT NOT NULL DEFAULT '{}',
      translations TEXT NOT NULL DEFAULT '{}',
      fetched_at INTEGER NOT NULL
    );
  `)

  // Add category_id column to existing cached_articles tables
  const articleCols = expoDb.getAllSync<{ name: string }>(
    `PRAGMA table_info(cached_articles)`
  )
  if (!articleCols.some((c) => c.name === 'category_id')) {
    expoDb.execSync(
      `ALTER TABLE cached_articles ADD COLUMN category_id TEXT`
    )
  }

  // Add fields column to existing cached_asset_classes tables
  const cols = expoDb.getAllSync<{ name: string }>(
    `PRAGMA table_info(cached_asset_classes)`
  )
  if (!cols.some((c) => c.name === 'fields')) {
    expoDb.execSync(
      `ALTER TABLE cached_asset_classes ADD COLUMN fields TEXT NOT NULL DEFAULT '[]'`
    )
  }
  if (!cols.some((c) => c.name === 'aggregation_keys')) {
    expoDb.execSync(
      `ALTER TABLE cached_asset_classes ADD COLUMN aggregation_keys TEXT NOT NULL DEFAULT '[]'`
    )
  }

  // Add translations column to existing cached_article_categories tables
  const catCols = expoDb.getAllSync<{ name: string }>(
    `PRAGMA table_info(cached_article_categories)`
  )
  if (!catCols.some((c) => c.name === 'translations')) {
    expoDb.execSync(
      `ALTER TABLE cached_article_categories ADD COLUMN translations TEXT NOT NULL DEFAULT '{}'`
    )
  }

  // Add lastPrice columns to existing cached_stocks tables
  const stockCols = expoDb.getAllSync<{ name: string }>(
    `PRAGMA table_info(cached_stocks)`
  )
  if (!stockCols.some((c) => c.name === 'last_price')) {
    expoDb.execSync(
      `ALTER TABLE cached_stocks ADD COLUMN last_price REAL`
    )
  }
  if (!stockCols.some((c) => c.name === 'last_price_updated_at')) {
    expoDb.execSync(
      `ALTER TABLE cached_stocks ADD COLUMN last_price_updated_at TEXT`
    )
  }
  if (!stockCols.some((c) => c.name === 'about')) {
    expoDb.execSync(
      `ALTER TABLE cached_stocks ADD COLUMN about TEXT`
    )
  }

  // Add skippable column to existing cached_onboarding_screens tables
  const obCols = expoDb.getAllSync<{ name: string }>(
    'PRAGMA table_info(cached_onboarding_screens)'
  )
  if (!obCols.some((c) => c.name === 'skippable')) {
    expoDb.execSync(
      'ALTER TABLE cached_onboarding_screens ADD COLUMN skippable INTEGER NOT NULL DEFAULT 1'
    )
  }
}

/** Wipe all cached app data (stocks, articles, rates, etc). Does NOT touch user data.
 *  Also resets sync timestamps so next fetch does a full sync. */
export function clearAppCache(resetSyncTimestamps?: () => void) {
  resetSyncTimestamps?.()

  expoDb.execSync(`
    DELETE FROM cached_prices;
    DELETE FROM cached_stocks;
    DELETE FROM cached_micro_lessons;
    DELETE FROM cached_article_categories;
    DELETE FROM cached_articles;
    DELETE FROM cached_asset_classes;
    DELETE FROM cached_lookups;
    DELETE FROM cached_languages;
    DELETE FROM cached_translation_bundles;
    DELETE FROM cached_onboarding_screens;
    DELETE FROM cached_learning_cards;
    DELETE FROM cached_countries;
    DELETE FROM cached_exchange_rates;
    DELETE FROM cached_screening_rules;
    DELETE FROM cached_stock_compliance;
    DELETE FROM cached_portfolio_presets;
  `)
}
