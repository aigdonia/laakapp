import { useQuery } from '@tanstack/react-query'
import type { Country } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb } from '@/src/db'
import { cachedCountries } from '@/src/db/app-schema'
import { SUPPORTED_COUNTRIES } from '@/src/i18n/locale'

export const STALE_24H = 1000 * 60 * 60 * 24

async function syncCountriesToCache(data: Country[]) {
  await appDb.delete(cachedCountries)
  if (data.length > 0) {
    await appDb.insert(cachedCountries).values(
      data.map((c) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        currency: c.currency,
        flagEmoji: c.flagEmoji,
        enabled: c.enabled,
        translations: JSON.stringify(c.translations ?? {}),
        fetchedAt: new Date(),
      })),
    )
  }
}

export async function fetchOrCacheCountries(): Promise<Country[]> {
  try {
    const data = await api.get<Country[]>('/countries')
    await syncCountriesToCache(data)
    return data
  } catch {
    const cached = await appDb.select().from(cachedCountries)
    if (cached.length > 0) {
      return cached.map((row) => ({
        ...row,
        translations: JSON.parse(row.translations as string),
        createdAt: '',
        updatedAt: '',
      })) as unknown as Country[]
    }
    // Ultimate fallback: hardcoded list
    return SUPPORTED_COUNTRIES.map((c) => ({
      id: c.code,
      code: c.code,
      name: c.name,
      currency: '',
      flagEmoji: c.flag,
      enabled: true,
      translations: {},
      createdAt: '',
      updatedAt: '',
    }))
  }
}

/** Returns only enabled countries for display in the picker. */
export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheCountries,
    select: (data) => data.filter((c) => c.enabled),
  })
}
