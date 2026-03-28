import { useQuery } from '@tanstack/react-query'
import type { ExchangeRate } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb } from '@/src/db'
import { cachedExchangeRates } from '@/src/db/app-schema'

export const STALE_24H = 1000 * 60 * 60 * 24

async function syncExchangeRatesToCache(data: ExchangeRate[]) {
  await appDb.delete(cachedExchangeRates)
  if (data.length > 0) {
    await appDb.insert(cachedExchangeRates).values(
      data.map((r) => ({
        currency: r.currency,
        ratePerUsd: r.ratePerUsd,
        enabled: r.enabled,
        fetchedAt: new Date(),
      })),
    )
  }
}

export async function fetchOrCacheExchangeRates(): Promise<ExchangeRate[]> {
  try {
    const data = await api.get<ExchangeRate[]>('/exchange-rates')
    await syncExchangeRatesToCache(data)
    return data
  } catch {
    const cached = await appDb.select().from(cachedExchangeRates)
    if (cached.length > 0) {
      return cached.map((row) => ({
        ...row,
        id: row.currency,
        createdAt: '',
        updatedAt: '',
      })) as unknown as ExchangeRate[]
    }
    return []
  }
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheExchangeRates,
  })
}
