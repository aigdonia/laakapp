import { useQuery } from '@tanstack/react-query'
import { sql } from 'drizzle-orm'

import { userDb, transactions } from '@/src/db'
import { parseHoldingKey } from '@/src/db/aggregation-queries'

type TransactionRow = typeof transactions.$inferSelect

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''")
}

export function useHoldingDetail(holdingKey: string) {
  return useQuery({
    queryKey: ['holdings', holdingKey],
    queryFn: async () => {
      const parsed = parseHoldingKey(holdingKey)

      // Build WHERE conditions
      const conditions = [`asset_type = '${escapeSql(parsed.assetType)}'`]
      for (const [col, val] of Object.entries(parsed.keyValues)) {
        if (val) {
          conditions.push(`${toSnakeCase(col)} = '${escapeSql(val)}'`)
        } else {
          conditions.push(`(${toSnakeCase(col)} IS NULL OR ${toSnakeCase(col)} = '')`)
        }
      }
      const whereClause = conditions.join(' AND ')

      const txns = await userDb
        .select()
        .from(transactions)
        .where(sql.raw(whereClause))
        .orderBy(sql.raw('date DESC'))

      if (txns.length === 0) throw new Error('No transactions found for this holding')

      // Compute aggregates from transactions
      let totalQuantity = 0
      let totalCost = 0
      for (const txn of txns) {
        if (txn.type === 'buy') {
          totalQuantity += txn.quantity
          totalCost += txn.quantity * txn.pricePerUnit
        } else {
          totalQuantity -= txn.quantity
        }
      }

      const firstTxn = txns[txns.length - 1] // oldest (sorted desc)
      const avgCostPerUnit = totalQuantity > 0 ? totalCost / totalQuantity : 0

      return {
        assetType: parsed.assetType,
        holdingKey,
        name: firstTxn.name,
        symbol: firstTxn.symbol,
        exchange: firstTxn.exchange,
        currency: firstTxn.currency,
        unit: firstTxn.unit,
        purity: firstTxn.purity,
        profitRate: firstTxn.profitRate,
        maturityDate: firstTxn.maturityDate,
        estimatedValue: firstTxn.estimatedValue,
        totalQuantity,
        totalCost,
        avgCostPerUnit,
        transactions: txns,
      }
    },
    enabled: !!holdingKey,
  })
}
