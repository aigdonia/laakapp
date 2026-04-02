import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core'

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['buy', 'sell'] }).notNull(),
  quantity: real('quantity').notNull(),
  pricePerUnit: real('price_per_unit').notNull(),
  fees: real('fees').default(0),
  notes: text('notes'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  // Identity fields (self-describing — no FK to holdings)
  assetType: text('asset_type', {
    enum: ['stock', 'etf', 'crypto', 'gold', 'cash', 'sukuk', 'real_estate', 'other'],
  }).notNull(),
  symbol: text('symbol'),
  name: text('name').notNull(),
  exchange: text('exchange'),
  currency: text('currency').notNull().default('EGP'),
  // Gold-specific
  unit: text('unit'),
  purity: text('purity'),
  // Sukuk-specific
  profitRate: real('profit_rate'),
  maturityDate: text('maturity_date'),
  // Real estate
  estimatedValue: real('estimated_value'),
  // Flexible extra data
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const aiAnalyses = sqliteTable('ai_analyses', {
  id: text('id').primaryKey(),
  holdingKey: text('holding_key').notNull(),
  type: text('type', { enum: ['stock_deepdive', 'portfolio_deep'] }).notNull(),
  content: text('content').notNull(),
  version: integer('version').notNull().default(1),
  creditTransactionId: text('credit_transaction_id'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const syncMeta = sqliteTable('sync_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})
