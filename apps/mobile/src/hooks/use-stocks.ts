import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import type { Stock } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedStocks } from '@/src/db'
import { usePreferences } from '@/src/store/preferences'

const STALE_24H = 1000 * 60 * 60 * 24

type StockSyncResponse = {
  data: Stock[]
  syncedAt: string
}

function getCountries(countryCode: string): string[] {
  return [countryCode, 'US']
}

async function syncStocksToCache(data: Stock[], isIncremental: boolean) {
  if (data.length === 0 && !isIncremental) {
    await appDb.delete(cachedStocks)
    return
  }

  if (!isIncremental) {
    await appDb.delete(cachedStocks)
  }

  if (data.length > 0) {
    // Upsert: delete existing then insert (SQLite INSERT OR REPLACE needs all cols)
    if (isIncremental) {
      for (const s of data) {
        await appDb.delete(cachedStocks).where(eq(cachedStocks.id, s.id))
      }
    }
    await appDb.insert(cachedStocks).values(
      data.map((s) => ({
        id: s.id,
        symbol: s.symbol,
        name: s.name,
        exchange: s.exchange,
        countryCode: s.countryCode,
        sector: s.sector,
        about: s.about ?? null,
        lastPrice: s.lastPrice ?? null,
        lastPriceUpdatedAt: s.lastPriceUpdatedAt ?? null,
        fetchedAt: new Date(),
      })),
    )
  }
}

export async function fetchOrCacheStocks(countryCode: string): Promise<Stock[]> {
  const { stocksSyncedAt, setStocksSyncedAt } = usePreferences.getState()

  try {
    const countries = getCountries(countryCode).join(',')
    let url = `/stocks?countries=${countries}`
    const isIncremental = !!stocksSyncedAt
    if (isIncremental) {
      url += `&updatedSince=${stocksSyncedAt}`
    }

    const response = await api.get<StockSyncResponse>(url)
    const { data, syncedAt } = response

    await syncStocksToCache(data, isIncremental)
    setStocksSyncedAt(syncedAt)

    if (isIncremental && data.length === 0) {
      // No changes — return from cache
      const cached = await appDb.select().from(cachedStocks)
      return cached as unknown as Stock[]
    }

    if (isIncremental) {
      // Merge: return full cache (which now has upserted data)
      const cached = await appDb.select().from(cachedStocks)
      return cached as unknown as Stock[]
    }

    return data
  } catch {
    const cached = await appDb.select().from(cachedStocks)
    if (cached.length > 0) return cached as unknown as Stock[]
    throw new Error('No stock data available (API unreachable and cache empty)')
  }
}

export function useStocks() {
  const countryCode = usePreferences((s) => s.countryCode)

  return useQuery({
    queryKey: ['stocks', countryCode],
    staleTime: STALE_24H,
    queryFn: () => fetchOrCacheStocks(countryCode),
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
