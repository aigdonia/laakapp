import { useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import type { SQLiteTable } from 'drizzle-orm/sqlite-core'
import type { Article, ArticleCategory, LearningCard, MicroLesson, Translations } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedMicroLessons, cachedArticles, cachedArticleCategories, cachedLearningCards } from '@/src/db'

const STALE_24H = 1000 * 60 * 60 * 24

async function syncToCache<T extends { id: string }>(
  table: SQLiteTable,
  data: T[],
) {
  await appDb.delete(table)
  if (data.length > 0) {
    await appDb
      .insert(table)
      .values(data.map((row) => ({ ...row, fetchedAt: new Date() })))
  }
}

async function fetchOrCache<T extends { id: string }>(
  apiFn: () => Promise<T[]>,
  table: SQLiteTable,
  cacheFn: () => Promise<unknown[]>,
): Promise<T[]> {
  try {
    const data = await apiFn()
    await syncToCache(table, data)
    return data
  } catch {
    const cached = await cacheFn()
    if (cached.length > 0) return cached as T[]
    throw new Error('No data available (API unreachable and cache empty)')
  }
}

export function fetchOrCacheMicroLessons() {
  return fetchOrCache(
    () => api.get<MicroLesson[]>('/micro-lessons'),
    cachedMicroLessons,
    () =>
      appDb
        .select()
        .from(cachedMicroLessons)
        .orderBy(cachedMicroLessons.order),
  )
}

export function useMicroLessons() {
  return useQuery({
    queryKey: ['micro-lessons'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheMicroLessons,
  })
}

export async function fetchOrCacheArticleCategories(): Promise<ArticleCategory[]> {
  try {
    const data = await api.get<ArticleCategory[]>('/article-categories')
    await appDb.delete(cachedArticleCategories)
    if (data.length > 0) {
      await appDb.insert(cachedArticleCategories).values(
        data.map((c) => ({
          ...c,
          translations: JSON.stringify(c.translations ?? {}),
          fetchedAt: new Date(),
        })),
      )
    }
    return data
  } catch {
    const cached = await appDb
      .select()
      .from(cachedArticleCategories)
      .orderBy(cachedArticleCategories.order)
    if (cached.length > 0) {
      return cached.map((row) => ({
        ...row,
        translations: JSON.parse(row.translations) as Translations,
      })) as unknown as ArticleCategory[]
    }
    throw new Error('No data available (API unreachable and cache empty)')
  }
}

export function useArticleCategories() {
  return useQuery({
    queryKey: ['article-categories'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheArticleCategories,
  })
}

export function fetchOrCacheArticles() {
  return fetchOrCache(
    () => api.get<Article[]>('/articles'),
    cachedArticles,
    () =>
      appDb
        .select()
        .from(cachedArticles)
        .where(eq(cachedArticles.status, 'published')),
  )
}

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheArticles,
  })
}

export function fetchOrCacheLearningCards() {
  return fetchOrCache(
    () => api.get<LearningCard[]>('/learning-cards'),
    cachedLearningCards,
    () =>
      appDb
        .select()
        .from(cachedLearningCards)
        .orderBy(cachedLearningCards.order),
  )
}

export function useLearningCards() {
  return useQuery({
    queryKey: ['learning-cards'],
    staleTime: STALE_24H,
    queryFn: fetchOrCacheLearningCards,
  })
}
