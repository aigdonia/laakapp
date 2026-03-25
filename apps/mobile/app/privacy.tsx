import { ScrollView, Text, useColorScheme } from 'react-native'
import Markdown from 'react-native-markdown-display'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Article } from '@fin-ai/shared'
import { useThemeColors } from '@/src/theme/colors'

const PRIVACY_SLUG = 'privacy-policy'

export default function PrivacyScreen() {
  const colors = useThemeColors()
  const isDark = useColorScheme() === 'dark'
  const queryClient = useQueryClient()

  const article = useMemo(() => {
    const articles = queryClient.getQueryData<Article[]>(['articles'])
    return articles?.find((a) => a.slug === PRIVACY_SLUG) ?? null
  }, [queryClient])

  const text = colors.text
  const muted = colors.tabInactive

  const markdownStyles = useMemo(
    () => ({
      body: { color: text, fontSize: 15, lineHeight: 24 },
      heading1: { color: text, fontSize: 22, fontWeight: '700' as const, marginBottom: 8, marginTop: 20 },
      heading2: { color: text, fontSize: 18, fontWeight: '700' as const, marginBottom: 6, marginTop: 16 },
      heading3: { color: text, fontSize: 16, fontWeight: '600' as const, marginBottom: 4, marginTop: 12 },
      paragraph: { marginBottom: 10 },
      link: { color: '#007AFF' },
      blockquote: {
        borderLeftWidth: 3,
        borderLeftColor: muted,
        paddingLeft: 12,
        marginVertical: 8,
        opacity: 0.85,
      },
      list_item: { marginBottom: 4 },
      strong: { fontWeight: '700' as const },
      bullet_list: { marginBottom: 8 },
      ordered_list: { marginBottom: 8 },
      hr: { backgroundColor: isDark ? '#3a3a3c' : '#e5e5ea', height: 1, marginVertical: 16 },
    }),
    [isDark, text, muted],
  )

  return (
    <ScrollView
      className="flex-1 bg-screen"
      contentContainerClassName="px-5 pt-6 pb-16"
    >
      <Text className="text-2xl font-extrabold text-text mb-1 leading-9">
        {article?.title ?? 'Privacy Policy'}
      </Text>
      <Text className="text-xs text-muted mb-5">
        Last updated: {article?.publishedAt?.split('T')[0] ?? '2026-03-26'}
      </Text>
      {article?.body ? (
        <Markdown style={markdownStyles}>{article.body}</Markdown>
      ) : (
        <Text className="text-sm text-muted">Privacy policy content is loading...</Text>
      )}
    </ScrollView>
  )
}
