import { useQuery } from '@tanstack/react-query'
import type { Language } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb } from '@/src/db'
import { cachedLanguages } from '@/src/db/app-schema'
import { FALLBACK_LANGUAGES } from '@/src/i18n/locale'

const STALE_24H = 1000 * 60 * 60 * 24

async function syncLanguagesToCache(data: Language[]) {
  await appDb.delete(cachedLanguages)
  if (data.length > 0) {
    await appDb.insert(cachedLanguages).values(
      data.map((l) => ({
        code: l.code,
        name: l.name,
        nativeName: l.nativeName,
        direction: l.direction,
        enabled: l.enabled,
        fetchedAt: new Date(),
      })),
    )
  }
}

export async function fetchOrCacheLanguages(): Promise<Language[]> {
  try {
    const data = await api.get<Language[]>('/languages')
    await syncLanguagesToCache(data)
    return data
  } catch {
    const cached = await appDb.select().from(cachedLanguages)
    if (cached.length > 0) {
      return cached.map((row) => ({
        ...row,
        id: row.code,
        createdAt: '',
        updatedAt: '',
      })) as unknown as Language[]
    }
    // Ultimate fallback: hardcoded list
    return FALLBACK_LANGUAGES
  }
}

/**
 * Returns only enabled, base languages (no country-locale variants).
 * Country-locales (codes containing `_`) are for translation overrides only.
 */
export function useDisplayLanguages() {
  return useQuery({
    queryKey: ['languages'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheLanguages,
    select: (data) =>
      data.filter((l) => l.enabled && !l.code.includes('_')),
  })
}

/** All languages including country-locales, for internal use (e.g. direction lookup). */
export function useLanguages() {
  return useQuery({
    queryKey: ['languages'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheLanguages,
  })
}
