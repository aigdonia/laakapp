import { useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, useColorScheme } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import Markdown from 'react-native-markdown-display'
import type { Article } from '@fin-ai/shared'
import { useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useThemeColors } from '@/src/theme/colors'
import { useActivityEvent } from '@/src/hooks/use-activity-event'

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const isDark = useColorScheme() === 'dark'
  const colors = useThemeColors()
  const queryClient = useQueryClient()
  const { t } = useTranslation('learn')

  const article = useMemo(() => {
    const articles = queryClient.getQueryData<Article[]>(['articles'])
    return articles?.find((a) => a.id === id) ?? null
  }, [id, queryClient])

  const { report } = useActivityEvent()
  const reported = useRef(false)
  useEffect(() => {
    if (article && !reported.current) {
      reported.current = true
      report('article_read', { articleId: article.id, slug: article.slug })
    }
  }, [article])

  // Markdown library requires style objects — cannot use className
  const text = colors.text
  const muted = colors.tabInactive

  const markdownStyles = useMemo(
    () => ({
      body: { color: text, fontSize: 16, lineHeight: 26 },
      heading1: { color: text, fontSize: 24, fontWeight: '700' as const, marginBottom: 8 },
      heading2: { color: text, fontSize: 20, fontWeight: '700' as const, marginBottom: 6 },
      heading3: { color: text, fontSize: 18, fontWeight: '600' as const, marginBottom: 4 },
      paragraph: { marginBottom: 12 },
      link: { color: '#007AFF' },
      blockquote: {
        borderLeftWidth: 3,
        borderLeftColor: muted,
        paddingLeft: 12,
        marginVertical: 8,
        opacity: 0.85,
      },
      code_inline: {
        backgroundColor: isDark ? '#3a3a3c' : '#e5e5ea',
        color: text,
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontSize: 14,
      },
      fence: {
        backgroundColor: isDark ? '#3a3a3c' : '#e5e5ea',
        color: text,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
      },
      list_item: { marginBottom: 4 },
      strong: { fontWeight: '700' as const },
    }),
    [isDark, text, muted],
  )

  if (!article) {
    return (
      <ScrollView
        className="flex-1 bg-screen"
        contentContainerClassName="p-6 items-center justify-center flex-grow"
      >
        <Text className="text-sm text-muted">{t('article_not_found')}</Text>
      </ScrollView>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-screen"
      contentContainerClassName="px-5 pt-6 pb-12"
    >
      <Text className="text-2xl font-extrabold text-text mb-5 leading-9">
        {article.title}
      </Text>
      <Markdown style={markdownStyles}>{article.body}</Markdown>
    </ScrollView>
  )
}
