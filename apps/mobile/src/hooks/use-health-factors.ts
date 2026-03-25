import { useQuery } from '@tanstack/react-query'
import { query } from '@/src/db/duckdb'
import type { HealthFactor } from '@/src/types/insights'

type StatsRow = {
  distinct_types: number
  total_value: number
  max_holding_pct: number
  last_transaction_ts: number | null
}

type TypeWeight = {
  type_cost: number
}

/**
 * Computes portfolio health factors via DuckDB SQL.
 * Returns 4 informational factors: Diversification, Concentration,
 * Asset Coverage, and Activity — all derived from SQL aggregation.
 */
export function useHealthFactors() {
  return useQuery({
    queryKey: ['health-factors'],
    queryFn: (): HealthFactor[] | null => {
      // Single CTE-based query for portfolio-wide stats
      const stats = query<StatsRow>(`
        WITH holdings AS (
          SELECT
            asset_type,
            symbol,
            exchange,
            currency,
            SUM(CASE WHEN type = 'buy' THEN quantity * price_per_unit ELSE 0 END) AS cost
          FROM transactions
          GROUP BY asset_type, symbol, exchange, currency
          HAVING SUM(CASE WHEN type = 'buy' THEN quantity ELSE -quantity END) > 0
        ),
        portfolio AS (
          SELECT COALESCE(SUM(cost), 0) AS total_value FROM holdings
        )
        SELECT
          (SELECT COUNT(DISTINCT asset_type) FROM holdings) AS distinct_types,
          (SELECT total_value FROM portfolio) AS total_value,
          (SELECT MAX(cost * 1.0 / p.total_value) FROM holdings, portfolio p WHERE p.total_value > 0) AS max_holding_pct,
          (SELECT MAX(date) FROM transactions) AS last_transaction_ts
      `)

      if (stats.length === 0 || !stats[0].total_value || stats[0].total_value === 0) {
        return null
      }

      const { distinct_types, total_value, max_holding_pct, last_transaction_ts } = stats[0]

      // Per-type costs for diversification weight deviation
      const typeWeights = query<TypeWeight>(`
        WITH holdings AS (
          SELECT
            asset_type,
            SUM(CASE WHEN type = 'buy' THEN quantity * price_per_unit ELSE 0 END) AS cost
          FROM transactions
          GROUP BY asset_type, symbol, exchange, currency
          HAVING SUM(CASE WHEN type = 'buy' THEN quantity ELSE -quantity END) > 0
        )
        SELECT SUM(cost) AS type_cost
        FROM holdings
        GROUP BY asset_type
      `)

      // --- Diversification (0-100) ---
      const groupCount = typeWeights.length
      let diversificationScore: number
      if (groupCount <= 1) {
        diversificationScore = 50
      } else {
        const idealWeight = 1 / groupCount
        const weightDeviation = typeWeights.reduce((sum, r) => {
          const weight = r.type_cost / total_value
          return sum + Math.abs(weight - idealWeight)
        }, 0)
        const maxDeviation = 2 * (1 - idealWeight)
        diversificationScore = Math.round((1 - weightDeviation / maxDeviation) * 100)
      }

      // --- Concentration (0-100) ---
      const maxWeight = max_holding_pct ?? 0
      const concentrationScore = maxWeight <= 0.3
        ? 100
        : maxWeight >= 0.8
          ? 10
          : Math.round(100 - ((maxWeight - 0.3) / 0.5) * 90)

      // --- Asset Coverage (0-100) ---
      const coverageScore = distinct_types >= 5 ? 100
        : distinct_types >= 4 ? 85
        : distinct_types >= 3 ? 70
        : distinct_types >= 2 ? 50
        : 25

      // --- Activity (0-100) ---
      // date column uses integer('date', { mode: 'timestamp' }) → stored as epoch seconds
      const now = Date.now()
      const daysSinceLast = last_transaction_ts
        ? (now - last_transaction_ts * 1000) / (1000 * 60 * 60 * 24)
        : 365
      const activityScore = daysSinceLast <= 30 ? 100
        : daysSinceLast <= 60 ? 75
        : daysSinceLast <= 90 ? 50
        : daysSinceLast <= 180 ? 25
        : 10

      return [
        {
          name: 'Diversification',
          score: diversificationScore,
          description: groupCount === 1
            ? 'All holdings in one asset class'
            : `Spread across ${groupCount} asset classes`,
        },
        {
          name: 'Concentration',
          score: concentrationScore,
          description: maxWeight > 0.3
            ? `Top holding is ${Math.round(maxWeight * 100)}% of portfolio`
            : 'No single holding exceeds 30%',
        },
        {
          name: 'Asset Coverage',
          score: coverageScore,
          description: `${distinct_types} asset type${distinct_types !== 1 ? 's' : ''} in portfolio`,
        },
        {
          name: 'Activity',
          score: activityScore,
          description: daysSinceLast < 1
            ? 'Active today'
            : `Last transaction ${Math.round(daysSinceLast)} days ago`,
        },
      ]
    },
  })
}
