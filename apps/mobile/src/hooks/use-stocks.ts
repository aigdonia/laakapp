import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Stock } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedStocks } from '@/src/db'

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

  const results = useMemo(() => {
    if (!query.trim() || !stocks) return []
    const q = query.toLowerCase()
    return stocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
      )
      .slice(0, 10)
  }, [query, stocks])

  return { results, ...rest }
}
