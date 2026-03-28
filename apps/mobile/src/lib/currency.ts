import type { ExchangeRate } from '@fin-ai/shared'

/** Build a lookup map from currency code → ratePerUsd */
export function buildRateMap(
  rates: ExchangeRate[],
): Record<string, number> {
  const map: Record<string, number> = {}
  for (const r of rates) {
    if (r.enabled) map[r.currency] = r.ratePerUsd
  }
  return map
}

/** Convert an amount from one currency to another using ratePerUsd lookup */
export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number {
  if (from === to) return amount
  const fromRate = rates[from]
  const toRate = rates[to]
  if (!fromRate || !toRate || fromRate === 0) return amount
  return amount * (toRate / fromRate)
}

/** Sum amounts across currencies into a single base currency total */
export function convertTotalToBase(
  costByCurrency: Record<string, number>,
  baseCurrency: string,
  rates: Record<string, number>,
): number {
  let total = 0
  for (const [currency, amount] of Object.entries(costByCurrency)) {
    total += convertCurrency(amount, currency, baseCurrency, rates)
  }
  return total
}
