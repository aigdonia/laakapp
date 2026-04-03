import { useQuery } from '@tanstack/react-query'
import type { Lookup } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedLookups } from '@/src/db'

const STALE_24H = 1000 * 60 * 60 * 24

async function syncLookupsToCache(data: Lookup[]) {
  await appDb.delete(cachedLookups)
  if (data.length > 0) {
    await appDb.insert(cachedLookups).values(
      data.map((l) => ({
        id: l.id,
        category: l.category,
        label: l.label,
        value: l.value,
        metadata: JSON.stringify(l.metadata ?? {}),
        order: l.order,
        enabled: l.enabled,
        fetchedAt: new Date(),
      })),
    )
  }
}

export async function fetchOrCacheLookups(): Promise<Lookup[]> {
  try {
    const data = await api.get<Lookup[]>('/lookups')
    await syncLookupsToCache(data)
    return data
  } catch {
    const cached = await appDb.select().from(cachedLookups)
    if (cached.length > 0) {
      return cached.map((row) => ({
        ...row,
        metadata: JSON.parse(row.metadata) as Record<string, string>,
        translations: {},
      })) as unknown as Lookup[]
    }
    throw new Error('No lookup data available (API unreachable and cache empty)')
  }
}

export function useLookups() {
  return useQuery({
    queryKey: ['lookups'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheLookups,
    select: (data) =>
      data
        .filter((l) => l.enabled)
        .sort((a, b) => a.order - b.order),
  })
}

/** Build a map of category → options[] from all lookups */
export function buildLookupOptionsMap(
  lookups: Lookup[] | undefined
): Record<string, { label: string; value: string; shortLabel?: string }[]> {
  if (!lookups) return {}
  const map: Record<string, { label: string; value: string; shortLabel?: string }[]> = {}
  for (const l of lookups) {
    if (!map[l.category]) map[l.category] = []
    map[l.category].push({ label: l.label, value: l.value, shortLabel: l.value })
  }
  return map
}
