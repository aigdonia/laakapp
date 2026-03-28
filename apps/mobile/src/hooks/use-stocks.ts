import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Stock } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedStocks } from '@/src/db'
import { usePreferences } from '@/src/store/preferences'

const STALE_24H = 1000 * 60 * 60 * 24

async function syncStocksToCache(data: Stock[]) {
  await appDb.delete(cachedStocks)
  if (data.length > 0) {
    await appDb.insert(cachedStocks).values(
      data.map((s) => ({
        id: s.id,
        symbol: s.symbol,
        name: s.name,
        exchange: s.exchange,
        countryCode: s.countryCode,
        sector: s.sector,
        fetchedAt: new Date(),
      })),
    )
  }
}

export async function fetchOrCacheStocks(): Promise<Stock[]> {
  try {
    const data = await api.get<Stock[]>('/stocks')
    await syncStocksToCache(data)
    return data
  } catch {
    const cached = await appDb.select().from(cachedStocks)
    if (cached.length > 0) return cached as unknown as Stock[]
    throw new Error('No stock data available (API unreachable and cache empty)')
  }
}

export function useStocks() {
  return useQuery({
    queryKey: ['stocks'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheStocks,
  })
}

export function useStockSearch(query: string) {
  const { data: stocks, ...rest } = useStocks()
  const countryCode = usePreferences((s) => s.countryCode)

  const results = useMemo(() => {
    if (!query.trim() || !stocks) return []
    const q = query.toLowerCase()
    const matched = stocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
    )

    // Priority: user's country first, then US, then rest
    matched.sort((a, b) => {
      const pa = a.countryCode === countryCode ? 0 : a.countryCode === 'US' ? 1 : 2
      const pb = b.countryCode === countryCode ? 0 : b.countryCode === 'US' ? 1 : 2
      return pa - pb
    })

    return matched.slice(0, 10)
  }, [query, stocks, countryCode])

  return { results, ...rest }
}
