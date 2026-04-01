import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { query } from '@/src/db/duckdb'
import { useExchangeRates } from './use-exchange-rates'
import { usePreferences, ACTIVITY_RHYTHM_DAYS } from '@/src/store/preferences'
import { buildRateMap, convertCurrency } from '@/src/lib/currency'
import type { HealthFactor } from '@/src/types/insights'
import type { StockComplianceLean } from '@fin-ai/shared'
import type { AggregatedHolding } from '@/src/types/holdings'

type HoldingRow = {
  asset_type: string
  currency: string
  cost: number
}

/**
 * Computes portfolio health factors.
 * Returns 4 factors: Concentration, Compliance, Asset Coverage, and Activity.
 */
export function useHealthFactors(
  complianceMap: Record<string, StockComplianceLean> | undefined,
  screenableHoldings: AggregatedHolding[],
) {
  const { data: exchangeRates } = useExchangeRates()
  const baseCurrency = usePreferences((s) => s.baseCurrency)
  const activityRhythm = usePreferences((s) => s.activityRhythm)

  const complianceFactor = useMemo((): HealthFactor | null => {
    const total = screenableHoldings.length
    if (total === 0) return null

    let compliant = 0
    for (const h of screenableHoldings) {
      const c = h.symbol ? complianceMap?.[h.symbol] : undefined
      if (c?.status === 'compliant') compliant++
    }

    const score = Math.round((compliant / total) * 100)
    return {
      name: 'Compliance',
      score,
      description: `${compliant} of ${total} holdings compliant`,
    }
  }, [screenableHoldings, complianceMap])

  const { data: dbFactors } = useQuery({
    queryKey: ['health-factors', baseCurrency, activityRhythm],
    queryFn: (): HealthFactor[] | null => {
      const rates = buildRateMap(exchangeRates ?? [])

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

      const convertedHoldings = holdingRows.map((r) => ({
        ...r,
        cost: convertCurrency(r.cost, r.currency, baseCurrency, rates),
      }))

      const totalValue = convertedHoldings.reduce((sum, r) => sum + r.cost, 0)
      if (totalValue === 0) return null

      const typeMap = new Map<string, number>()
      for (const h of convertedHoldings) {
        typeMap.set(h.asset_type, (typeMap.get(h.asset_type) ?? 0) + h.cost)
      }
      const distinctTypes = typeMap.size

      // Max single holding percentage
      const maxWeight = Math.max(...convertedHoldings.map((h) => h.cost / totalValue))

      // Last transaction timestamp
      const lastTxRow = query<{ last_ts: number | null }>(`
        SELECT MAX(date) AS last_ts FROM transactions
      `)
      const lastTransactionTs = lastTxRow[0]?.last_ts ?? null

      // --- Concentration (0-100) ---
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

      // --- Activity (0-100) — scored against user's preferred rhythm ---
      const now = Date.now()
      const daysSinceLast = lastTransactionTs
        ? (now - lastTransactionTs * 1000) / (1000 * 60 * 60 * 24)
        : 365
      const rhythmDays = ACTIVITY_RHYTHM_DAYS[activityRhythm]
      const activityScore = daysSinceLast <= rhythmDays ? 100
        : daysSinceLast <= rhythmDays * 1.5 ? 75
        : daysSinceLast <= rhythmDays * 2 ? 50
        : daysSinceLast <= rhythmDays * 3 ? 25
        : 10

      const factors: HealthFactor[] = [
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

      return factors
    },
  })

  // Merge compliance (from React state) with DB-derived factors
  const data = useMemo(() => {
    if (!dbFactors) return complianceFactor ? [complianceFactor] : null
    if (!complianceFactor) return dbFactors

    // Insert compliance after Concentration (index 0)
    const merged = [...dbFactors]
    merged.splice(1, 0, complianceFactor)
    return merged
  }, [dbFactors, complianceFactor])

  return { data }
}
