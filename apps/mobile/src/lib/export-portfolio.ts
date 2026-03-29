import { File, Paths } from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import type { AssetClass, ExchangeRate } from '@fin-ai/shared'

import { query } from '@/src/db/duckdb'
import { buildHoldingsQuery } from '@/src/db/aggregation-queries'
import { buildRateMap, convertCurrency } from '@/src/lib/currency'
import type { AggregatedHolding, AssetType } from '@/src/types/holdings'

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

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatNumber(n: number, decimals = 2): string {
  return n.toFixed(decimals)
}

function formatDate(timestamp: number | null): string {
  if (!timestamp) return ''
  return new Date(timestamp).toISOString().split('T')[0]
}

export async function exportPortfolioCsv(
  assetClasses: AssetClass[],
  exchangeRates: ExchangeRate[],
  baseCurrency: string,
): Promise<void> {
  const sql = buildHoldingsQuery(assetClasses)
  const rows = query<AggRow>(sql)
  const holdings = rows.map(rowToHolding)
  const rates = buildRateMap(exchangeRates)

  const headers = [
    'Asset Class',
    'Name',
    'Symbol',
    'Exchange',
    'Quantity',
    'Avg Cost/Unit',
    'Cost Basis',
    'Currency',
    `Cost Basis (${baseCurrency})`,
    'Transactions',
    'First Date',
    'Last Date',
  ]

  const csvRows = holdings.map((h) => {
    const assetClass = assetClasses.find((ac) => ac.slug === h.assetType)
    const costInBase = convertCurrency(h.totalCost, h.currency, baseCurrency, rates)

    return [
      escapeCsv(assetClass?.name ?? h.assetType),
      escapeCsv(h.name ?? ''),
      escapeCsv(h.symbol ?? ''),
      escapeCsv(h.exchange ?? ''),
      formatNumber(h.totalQuantity, 4),
      formatNumber(h.avgCostPerUnit),
      formatNumber(h.totalCost),
      h.currency,
      formatNumber(costInBase),
      String(h.transactionCount),
      formatDate(h.firstDate),
      formatDate(h.lastDate),
    ].join(',')
  })

  const csv = [headers.join(','), ...csvRows].join('\n')

  const date = new Date().toISOString().split('T')[0]
  const filename = `laak-portfolio-${date}-${baseCurrency}.csv`
  const file = new File(Paths.cache, filename)
  file.create({ overwrite: true })
  file.write(csv)

  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv',
    UTI: 'public.comma-separated-values-text',
  })
}
