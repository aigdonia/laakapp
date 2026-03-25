import { useState, useMemo } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { useArticles, useArticleCategories } from '@/src/hooks/use-learn-content'
import type { Article, ArticleCategory } from '@fin-ai/shared'
import { t as translateContent } from '@/src/lib/translate'

function CategoryCard({
  category,
  articleCount,
  onPress,
}: {
  category: ArticleCategory
  articleCount: number
  onPress: () => void
}) {
  const { t } = useTranslation('learn')

  return (
    <Pressable
      className="rounded-2xl p-5 bg-card active:opacity-70"
      onPress={onPress}
    >
      <Text className="text-lg font-bold text-text">
        {category.icon}  {translateContent(category.title, category.translations, 'title')}
      </Text>
      <Text className="text-sm text-muted mt-1">
        {articleCount === 1
          ? t('article_count', { count: articleCount })
          : t('article_count_plural', { count: articleCount })}
      </Text>
    </Pressable>
  )
}

function ArticleCard({
  title,
  summary,
  onPress,
}: {
  title: string
  summary: string
  onPress: () => void
}) {
  return (
    <Pressable
      className="rounded-2xl p-5 bg-card active:opacity-70"
      onPress={onPress}
    >
      <Text className="text-lg font-bold text-text">{title}</Text>
      <Text
        numberOfLines={2}
        className="text-sm text-muted mt-2 leading-relaxed"
      >
        {summary}
      </Text>
    </Pressable>
  )
}

export default function LearnScreen() {
  const articles = useArticles()
  const categoriesQuery = useArticleCategories()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { t } = useTranslation('learn')

  const isSearching = search.trim().length > 0

  const filtered = useMemo(() => {
    if (!articles.data) return []
    if (!isSearching) return articles.data
    const q = search.toLowerCase()
    return articles.data.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q),
    )
  }, [articles.data, search, isSearching])

  const enabledCategories = useMemo(() => {
    if (!categoriesQuery.data) return []
    return categoriesQuery.data
      .filter((c) => c.enabled)
      .sort((a, b) => a.order - b.order)
  }, [categoriesQuery.data])

  const publishedArticles = useMemo(() => {
    if (!articles.data) return []
    return articles.data.filter((a) => a.status === 'published')
  }, [articles.data])

  const articleCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const article of publishedArticles) {
      if (article.categoryId) {
        counts[article.categoryId] = (counts[article.categoryId] || 0) + 1
      }
    }
    return counts
  }, [publishedArticles])

  const isLoading = articles.isLoading || categoriesQuery.isLoading
  const isError = articles.isError && categoriesQuery.isError

  return (
    <ScrollView
      className="flex-1 bg-screen"
      contentContainerClassName="px-5 pb-32"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mt-6">
        <Text className="text-xs font-semibold uppercase tracking-wider text-muted">
          {t('title')}
        </Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('search_articles')}
          placeholderTextColorClassName="text-subtle"
          className="bg-input rounded-xl px-4 py-3 text-base text-text mt-3"
        />

        <View className="gap-3 mt-3">
          {isLoading ? (
            <View className="py-6 items-center">
              <ActivityIndicator colorClassName="text-muted" />
            </View>
          ) : isError ? (
            <View className="bg-card rounded-2xl p-5 items-center">
              <Text className="text-sm text-muted">{t('could_not_load')}</Text>
            </View>
          ) : isSearching ? (
            filtered.length === 0 ? (
              <View className="py-6 items-center">
                <Text className="text-sm text-muted">{t('no_articles_found')}</Text>
              </View>
            ) : (
              filtered.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  summary={article.summary}
                  onPress={() => router.push(`/article/${article.id}`)}
                />
              ))
            )
          ) : enabledCategories.length === 0 ? (
            publishedArticles.length === 0 ? (
              <View className="py-6 items-center">
                <Text className="text-sm text-muted">{t('no_content')}</Text>
              </View>
            ) : (
              publishedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  summary={article.summary}
                  onPress={() => router.push(`/article/${article.id}`)}
                />
              ))
            )
          ) : (
            enabledCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                articleCount={articleCountByCategory[category.id] || 0}
                onPress={() => router.push(`/category/${category.id}`)}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  )
}
