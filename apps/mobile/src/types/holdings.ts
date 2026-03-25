export const ASSET_TYPES = [
  'stock',
  'etf',
  'crypto',
  'gold',
  'cash',
  'sukuk',
  'real_estate',
  'other',
] as const

export type AssetType = (typeof ASSET_TYPES)[number]

/** Form state — all values as strings for TextInput compatibility, parsed on submit */
export interface TransactionDraft {
  transactionType: 'buy' | 'sell'
  assetType: AssetType
  symbol: string
  name: string
  exchange: string
  quantity: string
  costPerUnit: string
  currency: string
  unit: string
  purity: string
  profitRate: string
  maturityDate: string
  estimatedValue: string
  date: string
  fees: string
  notes: string
}

/** @deprecated Use TransactionDraft instead */
export type HoldingDraft = TransactionDraft

/** Aggregated holding computed from transactions via GROUP BY */
export interface AggregatedHolding {
  holdingKey: string
  assetType: AssetType
  name: string | null
  symbol: string | null
  exchange: string | null
  currency: string
  totalQuantity: number
  totalCost: number
  avgCostPerUnit: number
  transactionCount: number
  firstDate: number | null
  lastDate: number | null
}

export function createEmptyDraft(assetType: AssetType): TransactionDraft {
  const today = new Date().toISOString().split('T')[0]
  return {
    transactionType: 'buy',
    assetType,
    symbol: '',
    name: '',
    exchange: '',
    quantity: '',
    costPerUnit: '',
    currency: 'EGP',
    unit: 'g',
    purity: '24K',
    profitRate: '',
    maturityDate: '',
    estimatedValue: '',
    date: today,
    fees: '',
    notes: '',
  }
}
