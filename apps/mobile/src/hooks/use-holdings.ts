import { useQuery } from '@tanstack/react-query'
import type { AssetClass, Stock } from '@fin-ai/shared'

import { query } from '@/src/db/duckdb'
import { buildHoldingsQuery } from '@/src/db/aggregation-queries'
import { useAssetClasses } from './use-asset-classes'
import { useExchangeRates } from './use-exchange-rates'
import { useStocks } from './use-stocks'
import { usePreferences } from '@/src/store/preferences'
import { buildRateMap, convertCurrency, convertTotalToBase } from '@/src/lib/currency'
import type { AggregatedHolding, AssetType, EnrichedHolding } from '@/src/types/holdings'

export type HoldingGroup = {
  type: string
  assetClass: AssetClass | undefined
  totalValue: number
  totalCostInBase: number
  holdings: EnrichedHolding[]
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

type PriceEntry = { price: number; updatedAt: string | null }

function buildPriceMap(stocks: Stock[] | undefined): Map<string, PriceEntry> {
  const map = new Map<string, PriceEntry>()
  if (!stocks) return map
  for (const s of stocks) {
    if (s.lastPrice != null) {
      map.set(s.symbol, { price: s.lastPrice, updatedAt: s.lastPriceUpdatedAt })
    }
  }
  return map
}

function enrichHolding(h: AggregatedHolding, priceMap: Map<string, PriceEntry>): EnrichedHolding {
  const canPrice = (h.assetType === 'stock' || h.assetType === 'etf') && h.symbol
  const entry = canPrice ? priceMap.get(h.symbol!) : undefined

  if (!entry) {
    return { ...h, lastPrice: null, priceUpdatedAt: null, marketValue: null, gainLoss: null, gainLossPct: null }
  }

  const marketValue = h.totalQuantity * entry.price
  const gainLoss = marketValue - h.totalCost
  const gainLossPct = h.totalCost > 0 ? (gainLoss / h.totalCost) * 100 : null

  return {
    ...h,
    lastPrice: entry.price,
    priceUpdatedAt: entry.updatedAt,
    marketValue,
    gainLoss,
    gainLossPct,
  }
}

export function useHoldings() {
  const { data: assetClasses } = useAssetClasses()
  const { data: exchangeRates } = useExchangeRates()
  const { data: stocks } = useStocks()
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
      const priceMap = buildPriceMap(stocks)
      const byType = new Map<string, EnrichedHolding[]>()

      for (const h of holdings) {
        const enriched = enrichHolding(h, priceMap)
        const existing = byType.get(enriched.assetType) ?? []
        existing.push(enriched)
        byType.set(enriched.assetType, existing)
      }

      const groups: HoldingGroup[] = Array.from(byType.entries()).map(
        ([type, items]) => {
          const totalValue = items.reduce(
            (sum, h) => {
              const value = h.marketValue ?? h.totalCost
              return sum + convertCurrency(value, h.currency, baseCurrency, rates)
            },
            0,
          )
          const totalCostInBase = items.reduce(
            (sum, h) => sum + convertCurrency(h.totalCost, h.currency, baseCurrency, rates),
            0,
          )
          const assetClass = assetClasses?.find((ac) => ac.slug === type)
          items.sort((a, b) => (b.marketValue ?? b.totalCost) - (a.marketValue ?? a.totalCost))
          return { type, assetClass, totalValue, totalCostInBase, holdings: items }
        },
      )

      groups.sort((a, b) => b.totalValue - a.totalValue)

      const costByCurrency: Record<string, number> = {}
      for (const h of holdings) {
        costByCurrency[h.currency] =
          (costByCurrency[h.currency] ?? 0) + h.totalCost
      }

      const totalInBase = convertTotalToBase(costByCurrency, baseCurrency, rates)

      const totalMarketValueInBase = groups.reduce((sum, g) => sum + g.totalValue, 0)
      const totalGainLoss = totalMarketValueInBase - totalInBase
      const totalGainLossPct = totalInBase > 0 ? (totalGainLoss / totalInBase) * 100 : null

      return {
        groups,
        costByCurrency,
        totalInBase,
        totalMarketValueInBase,
        totalGainLoss,
        totalGainLossPct,
      }
    },
    enabled: !!assetClasses,
  })
}
