/**
 * Builds aggregation SQL for computing holdings from transactions.
 *
 * A "holding" = transactions grouped by asset class's aggregationKeys.
 * e.g. stocks group by [symbol, exchange], gold by [purity, unit], cash by [currency].
 */
import type { AssetClass } from '@fin-ai/shared'

/**
 * Build a UNION ALL query that aggregates transactions into holdings,
 * using each asset class's aggregation keys for grouping.
 */
export function buildHoldingsQuery(assetClasses: AssetClass[]): string {
  const subqueries = assetClasses.map((ac) => {
    const keys = ac.aggregationKeys
    const groupCols = keys.length > 0 ? keys.map(toSnakeCase) : ["name"]
    const selectIdentity = groupCols.map((col) => `${col}`).join(', ')
    const groupBy = groupCols.join(', ')

    // Build holding_key as "assetType:key1=val1:key2=val2:currency=XXX"
    // Always include currency since GROUP BY includes it
    const aggKeys = keys.length > 0 ? keys : ["name"]
    const allKeys = aggKeys.includes("currency") ? aggKeys : [...aggKeys, "currency"]
    const keyParts = allKeys.map(
      (key) => `'${key}=' || COALESCE(${toSnakeCase(key)}, '')`,
    )
    const holdingKeyExpr =
      `'${ac.slug}:' || ${keyParts.join(" || ':' || ")}`

    // Add name and symbol to SELECT for display if not already in group columns
    const extraCols: string[] = []
    if (!groupCols.includes('name')) extraCols.push('MAX(name) AS name')
    if (!groupCols.includes('symbol')) extraCols.push('MAX(symbol) AS symbol')
    if (!groupCols.includes('exchange')) extraCols.push('MAX(exchange) AS exchange')
    const extraSelect = extraCols.length > 0 ? ', ' + extraCols.join(', ') : ''

    return `
      SELECT
        ${holdingKeyExpr} AS holding_key,
        '${ac.slug}' AS asset_type,
        ${selectIdentity},
        currency${extraSelect},
        SUM(CASE WHEN type = 'buy' THEN quantity ELSE -quantity END) AS total_quantity,
        SUM(CASE WHEN type = 'buy' THEN quantity * price_per_unit ELSE 0 END) AS total_cost,
        COUNT(*) AS transaction_count,
        MIN(date) AS first_date,
        MAX(date) AS last_date
      FROM transactions
      WHERE asset_type = '${ac.slug}'
      GROUP BY ${groupBy}, currency
      HAVING total_quantity > 0 OR transaction_count > 0`
  })

  return subqueries.join('\nUNION ALL\n') + '\nORDER BY total_cost DESC'
}

/**
 * Build a query to get all transactions for a specific holding group.
 */
export function buildHoldingTransactionsQuery(
  holdingKey: string,
): { sql: string; assetType: string; keyValues: Record<string, string> } {
  const parsed = parseHoldingKey(holdingKey)

  const conditions = [`asset_type = '${escape(parsed.assetType)}'`]
  for (const [col, val] of Object.entries(parsed.keyValues)) {
    if (val) {
      conditions.push(`${toSnakeCase(col)} = '${escape(val)}'`)
    } else {
      conditions.push(`(${toSnakeCase(col)} IS NULL OR ${toSnakeCase(col)} = '')`)
    }
  }

  return {
    sql: `SELECT * FROM transactions WHERE ${conditions.join(' AND ')} ORDER BY date DESC`,
    assetType: parsed.assetType,
    keyValues: parsed.keyValues,
  }
}

/**
 * Build WHERE clause for deleting all transactions in a holding group.
 */
export function buildDeleteHoldingConditions(
  holdingKey: string,
): string {
  const parsed = parseHoldingKey(holdingKey)

  const conditions = [`asset_type = '${escape(parsed.assetType)}'`]
  for (const [col, val] of Object.entries(parsed.keyValues)) {
    if (val) {
      conditions.push(`${toSnakeCase(col)} = '${escape(val)}'`)
    } else {
      conditions.push(`(${toSnakeCase(col)} IS NULL OR ${toSnakeCase(col)} = '')`)
    }
  }

  return conditions.join(' AND ')
}

/**
 * Parse a holding key like "stock:AAPL:EGX" into assetType + key-value pairs.
 * Requires knowledge of what the aggregation keys are for that asset type.
 */
export function parseHoldingKey(holdingKey: string): {
  assetType: string
  keyValues: Record<string, string>
} {
  const parts = holdingKey.split(':')
  const assetType = parts[0]
  // The remaining parts are the key values (order matches aggregationKeys)
  const values = parts.slice(1)

  // We encode the key names in the values as key=value pairs for robustness
  const keyValues: Record<string, string> = {}
  for (const part of values) {
    const eqIdx = part.indexOf('=')
    if (eqIdx !== -1) {
      keyValues[part.slice(0, eqIdx)] = part.slice(eqIdx + 1)
    }
  }

  return { assetType, keyValues }
}

/**
 * Create a holding key from asset type and key-value pairs.
 * Format: "assetType:key1=val1:key2=val2"
 */
export function createHoldingKey(
  assetType: string,
  aggregationKeys: string[],
  values: Record<string, string | null | undefined>,
): string {
  const parts = aggregationKeys.map(
    (key) => `${key}=${values[key] ?? ''}`,
  )
  return `${assetType}:${parts.join(':')}`
}

/** camelCase → snake_case */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/** Basic SQL string escape */
function escape(str: string): string {
  return str.replace(/'/g, "''")
}
