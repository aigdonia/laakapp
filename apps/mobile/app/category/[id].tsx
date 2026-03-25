import { useMemo } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { IconChevronLeft } from '@tabler/icons-react-native'
import type { Article, ArticleCategory } from '@fin-ai/shared'
import { t as translateContent } from '@/src/lib/translate'
import { useThemeColors } from '@/src/theme/colors'
import { useTranslation } from 'react-i18next'

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const colors = useThemeColors()
  const { t } = useTranslation('learn')

  const category = useMemo(() => {
    const categories = queryClient.getQueryData<ArticleCategory[]>(['article-categories'])
    return categories?.find((c) => c.id === id) ?? null
  }, [id, queryClient])

  const articles = useMemo(() => {
    const all = queryClient.getQueryData<Article[]>(['articles'])
    if (!all) return []
    return all.filter((a) => a.categoryId === id && a.status === 'published')
  }, [id, queryClient])

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-screen">
        <Text className="text-sm text-muted">{t('category_not_found')}</Text>
      </View>
    )
  }

  const title = translateContent(category.title, category.translations, 'title')

  return (
    <View className="flex-1 bg-screen">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-16 pb-4">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <IconChevronLeft size={24} color={colors.text} />
        </Pressable>
        <View className="flex-1 flex-row items-center justify-center mr-6">
          <Text className="text-lg font-bold text-text" numberOfLines={1}>
            {category.icon}  {title}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Article count */}
        <Text className="text-sm font-semibold text-text px-1 mb-2">
          {t('articles_count', { count: articles.length })}
        </Text>

        {articles.length === 0 ? (
          <View className="bg-card rounded-2xl p-5 items-center">
            <Text className="text-sm text-muted">{t('no_articles_in_category')}</Text>
          </View>
        ) : (
          <View className="gap-3">
            {articles.map((article) => (
              <Pressable
                key={article.id}
                className="rounded-2xl p-5 bg-card active:opacity-70"
                onPress={() => router.push(`/article/${article.id}`)}
              >
                <Text className="text-lg font-bold text-text">{article.title}</Text>
                <Text
                  numberOfLines={2}
                  className="text-sm text-muted mt-2 leading-relaxed"
                >
                  {article.summary}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
