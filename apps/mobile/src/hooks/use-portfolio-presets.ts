import { useQuery } from '@tanstack/react-query'
import type { PortfolioPreset, PortfolioPresetAllocations } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedPortfolioPresets } from '@/src/db'

export const STALE_24H = 1000 * 60 * 60 * 24

async function syncPortfolioPresetsToCache(data: PortfolioPreset[]) {
  await appDb.delete(cachedPortfolioPresets)
  if (data.length > 0) {
    await appDb.insert(cachedPortfolioPresets).values(
      data.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        order: p.order,
        enabled: p.enabled,
        allocations: JSON.stringify(p.allocations ?? {}),
        translations: JSON.stringify(p.translations ?? {}),
        fetchedAt: new Date(),
      })),
    )
  }
}

export async function fetchOrCachePortfolioPresets(): Promise<PortfolioPreset[]> {
  try {
    const data = await api.get<PortfolioPreset[]>('/portfolio-presets')
    await syncPortfolioPresetsToCache(data)
    return data
  } catch {
    const cached = await appDb.select().from(cachedPortfolioPresets)
    if (cached.length > 0) {
      return cached.map((row) => ({
        ...row,
        allocations: JSON.parse(row.allocations) as PortfolioPresetAllocations,
        translations: JSON.parse(row.translations) as Record<string, Record<string, string>>,
      })) as unknown as PortfolioPreset[]
    }
    throw new Error('No portfolio preset data available (API unreachable and cache empty)')
  }
}

export function usePortfolioPresets() {
  return useQuery({
    queryKey: ['portfolio-presets'],
    staleTime: STALE_24H,
    queryFn: fetchOrCachePortfolioPresets,
    select: (data) =>
      data
        .filter((p) => p.enabled)
        .sort((a, b) => a.order - b.order),
  })
}
