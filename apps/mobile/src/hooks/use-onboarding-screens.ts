import { useQuery } from '@tanstack/react-query'
import type { OnboardingScreen, OnboardingChoice } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedOnboardingScreens } from '@/src/db'

export const STALE_24H = 1000 * 60 * 60 * 24

async function syncOnboardingScreensToCache(data: OnboardingScreen[]) {
  await appDb.delete(cachedOnboardingScreens)
  if (data.length > 0) {
    await appDb.insert(cachedOnboardingScreens).values(
      data.map((s) => ({
        id: s.id,
        type: s.type,
        slug: s.slug,
        imageUrl: s.imageUrl,
        choices: JSON.stringify(s.choices ?? []),
        order: s.order,
        enabled: s.enabled,
        translations: JSON.stringify(s.translations ?? {}),
        fetchedAt: new Date(),
      })),
    )
  }
}

export async function fetchOrCacheOnboardingScreens(): Promise<OnboardingScreen[]> {
  try {
    const data = await api.get<OnboardingScreen[]>('/onboarding-screens')
    await syncOnboardingScreensToCache(data)
    return data
  } catch {
    const cached = await appDb.select().from(cachedOnboardingScreens)
    if (cached.length > 0) {
      return cached.map((row) => ({
        ...row,
        choices: JSON.parse(row.choices) as OnboardingChoice[],
        translations: JSON.parse(row.translations) as OnboardingScreen['translations'],
      })) as unknown as OnboardingScreen[]
    }
    return []
  }
}

export function useOnboardingScreens() {
  return useQuery({
    queryKey: ['onboarding-screens'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheOnboardingScreens,
    select: (data) =>
      data
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order),
  })
}
