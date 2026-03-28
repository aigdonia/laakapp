import { useQuery } from '@tanstack/react-query'
import type { ScreeningRule } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedScreeningRules } from '@/src/db'

const STALE_24H = 1000 * 60 * 60 * 24

async function syncScreeningRulesToCache(data: ScreeningRule[]) {
  await appDb.delete(cachedScreeningRules)
  if (data.length > 0) {
    await appDb.insert(cachedScreeningRules).values(
      data.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        methodology: r.methodology,
        description: r.description,
        enabled: r.enabled,
        thresholds: JSON.stringify(r.thresholds ?? {}),
        translations: JSON.stringify(r.translations ?? {}),
        fetchedAt: new Date(),
      })),
    )
  }
}

async function fetchOrCacheScreeningRules(): Promise<ScreeningRule[]> {
  try {
    const data = await api.get<ScreeningRule[]>('/screening-rules')
    await syncScreeningRulesToCache(data)
    return data
  } catch {
    const cached = await appDb.select().from(cachedScreeningRules)
    if (cached.length > 0) {
      return cached.map((row) => ({
        ...row,
        thresholds: JSON.parse(row.thresholds) as Record<string, number>,
        translations: JSON.parse(row.translations) as Record<string, Record<string, string>>,
      })) as unknown as ScreeningRule[]
    }
    throw new Error('No screening rules available (API unreachable and cache empty)')
  }
}

export function useScreeningRules() {
  return useQuery({
    queryKey: ['screening-rules'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheScreeningRules,
    select: (data) => data.filter((r) => r.enabled),
  })
}
