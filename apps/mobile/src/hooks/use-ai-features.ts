import { useQuery } from '@tanstack/react-query'
import { createMMKV } from 'react-native-mmkv'

import { api } from '@/src/lib/api'

const mmkv = createMMKV({ id: 'ai-features-cache' })
const CACHE_KEY = 'ai-features'

type AiFeatureConfig = {
  slug: string
  name: string
  creditCost: number
  freeRefresh: boolean
  enabled: boolean
}

type AiFeaturesMap = Record<string, AiFeatureConfig>

function getCached(): AiFeaturesMap | null {
  const raw = mmkv.getString(CACHE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function useAiFeatures() {
  return useQuery({
    queryKey: ['ai-features'],
    queryFn: async () => {
      const features = await api.get<AiFeatureConfig[]>('/ai-features')

      const map: AiFeaturesMap = {}
      for (const f of features) {
        map[f.slug] = f
      }

      // Cache for offline use
      mmkv.set(CACHE_KEY, JSON.stringify(map))
      return map
    },
    placeholderData: getCached() ?? undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function getFeatureConfig(
  features: AiFeaturesMap | undefined,
  slug: string,
): { creditCost: number; freeRefresh: boolean; enabled: boolean } {
  const feature = features?.[slug]
  if (!feature) return { creditCost: 0, freeRefresh: false, enabled: true }
  return {
    creditCost: feature.creditCost,
    freeRefresh: feature.freeRefresh,
    enabled: feature.enabled,
  }
}
