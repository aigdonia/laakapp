import { useQuery } from '@tanstack/react-query'
import type { AssetClass } from '@fin-ai/shared'

import { query } from '@/src/db/duckdb'
import { buildHoldingsQuery } from '@/src/db/aggregation-queries'
import { useAssetClasses } from './use-asset-classes'
import { useExchangeRates } from './use-exchange-rates'
import { usePreferences } from '@/src/store/preferences'
import { buildRateMap, convertCurrency, convertTotalToBase } from '@/src/lib/currency'
import type { AggregatedHolding, AssetType } from '@/src/types/holdings'

export type HoldingGroup = {
  type: string
  assetClass: AssetClass | undefined
  totalValue: number
  holdings: AggregatedHolding[]
}

type AggRow = {
  holding_key: string
  asset_type: string
  name: string | null
  symbol: string | null
  exchange: string | null
  currency: string
  total_quantity: number
  total_cost: number
  transaction_count: number
  first_date: number | null
  last_date: number | null
}

function rowToHolding(row: AggRow): AggregatedHolding {
  const totalQuantity = row.total_quantity ?? 0
  const totalCost = row.total_cost ?? 0
  return {
    holdingKey: row.holding_key,
    assetType: row.asset_type as AssetType,
    name: row.name,
    symbol: row.symbol,
    exchange: row.exchange,
    currency: row.currency,
    totalQuantity,
    totalCost,
    avgCostPerUnit: totalQuantity > 0 ? totalCost / totalQuantity : 0,
    transactionCount: row.transaction_count ?? 0,
    firstDate: row.first_date,
    lastDate: row.last_date,
  }
}

export function useHoldings() {
  const { data: assetClasses } = useAssetClasses()
  const { data: exchangeRates } = useExchangeRates()
  const baseCurrency = usePreferences((s) => s.baseCurrency)

  return useQuery({
    queryKey: ['holdings'],
    queryFn: async () => {
      if (!assetClasses?.length) return []
      const sql = buildHoldingsQuery(assetClasses)
      const rows = query<AggRow>(sql)
      return rows.map(rowToHolding)
    },
    select: (holdings) => {
      const rates = buildRateMap(exchangeRates ?? [])
      const byType = new Map<string, AggregatedHolding[]>()

      for (const h of holdings) {
        const existing = byType.get(h.assetType) ?? []
        existing.push(h)
        byType.set(h.assetType, existing)
      }

      const groups: HoldingGroup[] = Array.from(byType.entries()).map(
        ([type, items]) => {
          const totalValue = items.reduce(
            (sum, h) => sum + convertCurrency(h.totalCost, h.currency, baseCurrency, rates),
            0,
          )
          const assetClass = assetClasses?.find((ac) => ac.slug === type)
          items.sort((a, b) => b.totalCost - a.totalCost)
          return { type, assetClass, totalValue, holdings: items }
        },
      )

      groups.sort((a, b) => b.totalValue - a.totalValue)

      const costByCurrency: Record<string, number> = {}
      for (const h of holdings) {
        costByCurrency[h.currency] =
          (costByCurrency[h.currency] ?? 0) + h.totalCost
      }

      const totalInBase = convertTotalToBase(costByCurrency, baseCurrency, rates)

      return { groups, costByCurrency, totalInBase }
    },
    enabled: !!assetClasses,
  })
}
