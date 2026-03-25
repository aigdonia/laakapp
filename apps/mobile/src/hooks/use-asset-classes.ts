import { useQuery } from '@tanstack/react-query'
import type { AssetClass, FieldConfig } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedAssetClasses } from '@/src/db'

export const STALE_24H = 1000 * 60 * 60 * 24

async function syncAssetClassesToCache(data: AssetClass[]) {
  await appDb.delete(cachedAssetClasses)
  if (data.length > 0) {
    await appDb.insert(cachedAssetClasses).values(
      data.map((ac) => ({
        id: ac.id,
        name: ac.name,
        slug: ac.slug,
        icon: ac.icon,
        color: ac.color,
        order: ac.order,
        enabled: ac.enabled,
        fields: JSON.stringify(ac.fields ?? []),
        aggregationKeys: JSON.stringify(ac.aggregationKeys ?? []),
        fetchedAt: new Date(),
      })),
    )
  }
}

export async function fetchOrCacheAssetClasses(): Promise<AssetClass[]> {
  try {
    const data = await api.get<AssetClass[]>('/asset-classes')
    await syncAssetClassesToCache(data)
    return data
  } catch {
    const cached = await appDb.select().from(cachedAssetClasses)
    if (cached.length > 0) {
      return cached.map((row) => ({
        ...row,
        fields: JSON.parse(row.fields) as FieldConfig[],
        aggregationKeys: JSON.parse(row.aggregationKeys) as string[],
      })) as unknown as AssetClass[]
    }
    throw new Error('No asset class data available (API unreachable and cache empty)')
  }
}

export function useAssetClasses() {
  return useQuery({
    queryKey: ['asset-classes'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheAssetClasses,
    select: (data) =>
      data
        .filter((ac) => ac.enabled)
        .sort((a, b) => a.order - b.order),
  })
}
