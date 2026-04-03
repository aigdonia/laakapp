import { useCallback, useEffect, useMemo, useState } from 'react'
import { Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated'
import Markdown from 'react-native-markdown-display'
import * as Haptics from 'expo-haptics'
import { IconBulb, IconX } from '@tabler/icons-react-native'

import { useThemeColors } from '@/src/theme/colors'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

type CardData = {
  title: string
  body: string
  imageUrl?: string
  dismissLabel?: string
}

let showFn: ((data: CardData) => void) | null = null

/** Show a learning card overlay from anywhere */
export function showLearningCard(data: CardData) {
  showFn?.(data)
}

export function LearningCardOverlay() {
  const colors = useThemeColors()
  const [data, setData] = useState<CardData | null>(null)

  const translateY = useSharedValue(SCREEN_HEIGHT)
  const backdropOpacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  const dismiss = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 })
    scale.value = withTiming(0.9, { duration: 200 })
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250, easing: Easing.in(Easing.ease) }, () => {
      runOnJS(setData)(null)
    })
  }, [])

  const show = useCallback((card: CardData) => {
    setData(card)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
    backdropOpacity.value = withTiming(1, { duration: 300 })
    scale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
  }, [])

  useEffect(() => {
    showFn = show
    return () => { showFn = null }
  }, [show])

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  const isDark = colors.text === '#ffffff'
  const text = colors.text
  const muted = isDark ? '#aeaeb2' : '#636366'

  const markdownStyles = useMemo(
    () => ({
      body: { color: text, fontSize: 17, lineHeight: 28 },
      heading1: { color: text, fontSize: 22, fontWeight: '700' as const, marginBottom: 8 },
      heading2: { color: text, fontSize: 20, fontWeight: '600' as const, marginBottom: 6 },
      heading3: { color: text, fontSize: 18, fontWeight: '600' as const, marginBottom: 4 },
      paragraph: { marginBottom: 14 },
      link: { color: colors.accent },
      strong: { fontWeight: '700' as const },
      blockquote: {
        borderLeftWidth: 3,
        borderLeftColor: muted,
        paddingLeft: 14,
        marginVertical: 10,
        opacity: 0.85,
      },
      bullet_list: { marginBottom: 12 },
      ordered_list: { marginBottom: 12 },
      list_item: { marginBottom: 6, fontSize: 17, lineHeight: 28 },
      code_inline: {
        backgroundColor: isDark ? '#3a3a3c' : '#e5e5ea',
        color: text,
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontSize: 15,
      },
    }),
    [text, muted, isDark, colors.accent],
  )

  if (!data) return null

  const cardBg = isDark ? '#1c1c1e' : '#ffffff'

  return (
    <View className="absolute inset-0 z-[9997] items-center justify-center" pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0"
        style={[{ backgroundColor: 'rgba(0,0,0,0.5)' }, backdropStyle]}
        pointerEvents="auto"
      >
        <Pressable className="flex-1" onPress={dismiss} />
      </Animated.View>

      {/* Card */}
      <Animated.View
        className="mx-6 w-full max-w-sm rounded-2xl px-5 py-5"
        style={[
          {
            backgroundColor: cardBg,
            borderWidth: 1,
            borderColor: colors.accent,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.5 : 0.15,
            shadowRadius: 24,
            elevation: 12,
          },
          cardStyle,
        ]}
        pointerEvents="auto"
      >
        {/* Header: icon + title + X */}
        <View className="flex-row items-center mb-4">
          <IconBulb size={22} color={colors.accent} />
          <Text className="text-lg font-bold text-text ml-2 flex-1" numberOfLines={2}>
            {data.title}
          </Text>
          <Pressable
            className="p-1 active:opacity-50"
            onPress={dismiss}
            hitSlop={12}
          >
            <IconX size={18} color={colors.muted} />
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
          {data.imageUrl ? (
            <Image
              source={{ uri: data.imageUrl }}
              className="w-full h-40 rounded-xl mb-3"
              resizeMode="cover"
            />
          ) : null}
          <Markdown style={markdownStyles}>{data.body}</Markdown>
        </ScrollView>

        {/* Dismiss button */}
        <Pressable
          className="rounded-xl py-3 items-center active:opacity-80 mt-4 border border-border"
          onPress={dismiss}
        >
          <Text className="text-sm font-medium text-muted">
            {data.dismissLabel || 'Got it'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  )
}
