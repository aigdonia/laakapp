import type { AppSettings } from '@fin-ai/shared'
import { queryClient } from './query-client'
import { api } from './api'
import { fetchOrCacheAssetClasses, STALE_24H } from '../hooks/use-asset-classes'
import { fetchOrCacheLookups } from '../hooks/use-lookups'
import { fetchOrCacheStocks } from '../hooks/use-stocks'
import {
  fetchOrCacheMicroLessons,
  fetchOrCacheArticles,
  fetchOrCacheArticleCategories,
  fetchOrCacheLearningCards,
} from '../hooks/use-learn-content'
import { fetchOrCacheLanguages } from '../hooks/use-languages'
import { fetchOrCacheCountries } from '../hooks/use-countries'
import { fetchOrCacheOnboardingScreens } from '../hooks/use-onboarding-screens'
import { fetchOrCachePortfolioPresets } from '../hooks/use-portfolio-presets'
import { fetchOrCacheExchangeRates } from '../hooks/use-exchange-rates'
import { loadRemoteTranslations } from '../i18n'
import { usePreferences } from '../store/preferences'
import { resolveLocale } from '../i18n/locale'

export async function prefetchAppData(
  onProgress?: (progress: number) => void,
): Promise<void> {
  const { language, countryCode } = usePreferences.getState()
  const locale = resolveLocale(language || 'en', countryCode || 'EG')
  const promises = [
    queryClient.prefetchQuery({
      queryKey: ['app-settings'],
      queryFn: () => api.get<AppSettings>('/app-settings'),
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['languages'],
      queryFn: fetchOrCacheLanguages,
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['countries'],
      queryFn: fetchOrCacheCountries,
      staleTime: STALE_24H,
    }),
    loadRemoteTranslations(locale),
    queryClient.prefetchQuery({
      queryKey: ['asset-classes'],
      queryFn: fetchOrCacheAssetClasses,
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['lookups'],
      queryFn: fetchOrCacheLookups,
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['stocks', countryCode],
      queryFn: () => fetchOrCacheStocks(countryCode || 'EG'),
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['articles'],
      queryFn: fetchOrCacheArticles,
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['article-categories'],
      queryFn: fetchOrCacheArticleCategories,
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['micro-lessons'],
      queryFn: fetchOrCacheMicroLessons,
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['learning-cards'],
      queryFn: fetchOrCacheLearningCards,
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['onboarding-screens'],
      queryFn: fetchOrCacheOnboardingScreens,
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['portfolio-presets'],
      queryFn: fetchOrCachePortfolioPresets,
      staleTime: STALE_24H,
    }),
    queryClient.prefetchQuery({
      queryKey: ['exchange-rates'],
      queryFn: fetchOrCacheExchangeRates,
      staleTime: STALE_24H,
    }),
  ]

  let completed = 0
  const total = promises.length

  await Promise.allSettled(
    promises.map((p) =>
      p.finally(() => {
        completed++
        onProgress?.(completed / total)
      }),
    ),
  )
}
