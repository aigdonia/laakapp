import { useQuery } from '@tanstack/react-query'
import { query } from '@/src/db/duckdb'
import { useExchangeRates } from './use-exchange-rates'
import { usePreferences } from '@/src/store/preferences'
import { buildRateMap, convertCurrency } from '@/src/lib/currency'
import type { HealthFactor } from '@/src/types/insights'

type HoldingRow = {
  asset_type: string
  currency: string
  cost: number
}

type TypeWeight = {
  type_cost: number
}

/**
 * Computes portfolio health factors via DuckDB SQL.
 * Returns 4 informational factors: Diversification, Concentration,
 * Asset Coverage, and Activity — all derived from SQL aggregation.
 * All monetary values are converted to baseCurrency before scoring.
 */
export function useHealthFactors() {
  const { data: exchangeRates } = useExchangeRates()
  const baseCurrency = usePreferences((s) => s.baseCurrency)

  return useQuery({
    queryKey: ['health-factors', baseCurrency],
    queryFn: (): HealthFactor[] | null => {
      const rates = buildRateMap(exchangeRates ?? [])

      // Fetch per-holding rows with currency for conversion
      const holdingRows = query<HoldingRow>(`
        SELECT
          asset_type,
          currency,
          SUM(CASE WHEN type = 'buy' THEN quantity * price_per_unit ELSE 0 END) AS cost
        FROM transactions
        GROUP BY asset_type, symbol, exchange, currency
        HAVING SUM(CASE WHEN type = 'buy' THEN quantity ELSE -quantity END) > 0
      `)

      if (holdingRows.length === 0) return null

      // Convert each holding's cost to baseCurrency
      const convertedHoldings = holdingRows.map((r) => ({
        ...r,
        cost: convertCurrency(r.cost, r.currency, baseCurrency, rates),
      }))

      const totalValue = convertedHoldings.reduce((sum, r) => sum + r.cost, 0)
      if (totalValue === 0) return null

      // Group by asset_type for diversification
      const typeMap = new Map<string, number>()
      for (const h of convertedHoldings) {
        typeMap.set(h.asset_type, (typeMap.get(h.asset_type) ?? 0) + h.cost)
      }
      const typeCosts = Array.from(typeMap.values())
      const distinctTypes = typeCosts.length

      // Max single holding percentage
      const maxHoldingPct = Math.max(...convertedHoldings.map((h) => h.cost / totalValue))

      // Last transaction timestamp
      const lastTxRow = query<{ last_ts: number | null }>(`
        SELECT MAX(date) AS last_ts FROM transactions
      `)
      const lastTransactionTs = lastTxRow[0]?.last_ts ?? null

      // --- Diversification (0-100) ---
      const groupCount = typeCosts.length
      let diversificationScore: number
      if (groupCount <= 1) {
        diversificationScore = 50
      } else {
        const idealWeight = 1 / groupCount
        const weightDeviation = typeCosts.reduce((sum, tc) => {
          const weight = tc / totalValue
          return sum + Math.abs(weight - idealWeight)
        }, 0)
        const maxDeviation = 2 * (1 - idealWeight)
        diversificationScore = Math.round((1 - weightDeviation / maxDeviation) * 100)
      }

      // --- Concentration (0-100) ---
      const maxWeight = maxHoldingPct
      const concentrationScore = maxWeight <= 0.3
        ? 100
        : maxWeight >= 0.8
          ? 10
          : Math.round(100 - ((maxWeight - 0.3) / 0.5) * 90)

      // --- Asset Coverage (0-100) ---
      const coverageScore = distinctTypes >= 5 ? 100
        : distinctTypes >= 4 ? 85
        : distinctTypes >= 3 ? 70
        : distinctTypes >= 2 ? 50
        : 25

      // --- Activity (0-100) ---
      const now = Date.now()
      const daysSinceLast = lastTransactionTs
        ? (now - lastTransactionTs * 1000) / (1000 * 60 * 60 * 24)
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
          description: `${distinctTypes} asset type${distinctTypes !== 1 ? 's' : ''} in portfolio`,
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
