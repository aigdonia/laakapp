import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Pressable, Text, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { IconX } from '@tabler/icons-react-native'
import { useRouter } from 'expo-router'

import { useThemeColors } from '@/src/theme/colors'
import { CreditIcon } from './credit-icon'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

type AlertMode =
  | { type: 'action'; title: string; message: string; actionLabel: string; route: string }
  | { type: 'celebration'; title: string; message: string; timeout: number }

let showFn: ((data: AlertMode) => void) | null = null

/** Show insufficient credits alert — navigates to a route on action */
export function showCreditsAlert(data: { title: string; message: string; actionLabel: string }) {
  showFn?.({ type: 'action', ...data, route: '/credits' })
}

/** Show celebration card — auto-dismisses after timeout ms (default 3000) */
export function showCelebration(data: { title: string; message: string; timeout?: number }) {
  showFn?.({ type: 'celebration', timeout: data.timeout ?? 3000, ...data })
}

export function CreditsAlertOverlay() {
  const colors = useThemeColors()
  const router = useRouter()
  const [data, setData] = useState<AlertMode | null>(null)
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const translateY = useSharedValue(SCREEN_HEIGHT)
  const backdropOpacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  const dismiss = useCallback(() => {
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current)
      autoDismissTimer.current = null
    }
    backdropOpacity.value = withTiming(0, { duration: 200 })
    scale.value = withTiming(0.9, { duration: 200 })
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250, easing: Easing.in(Easing.ease) }, () => {
      runOnJS(setData)(null)
    })
  }, [])

  const show = useCallback((alert: AlertMode) => {
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current)
      autoDismissTimer.current = null
    }

    setData(alert)

    if (alert.type === 'celebration') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    }

    translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
    backdropOpacity.value = withTiming(1, { duration: 300 })
    scale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })

    if (alert.type === 'celebration') {
      autoDismissTimer.current = setTimeout(() => {
        dismiss()
      }, alert.timeout)
    }
  }, [dismiss])

  useEffect(() => {
    showFn = show
    return () => {
      showFn = null
      if (autoDismissTimer.current) clearTimeout(autoDismissTimer.current)
    }
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

  if (!data) return null

  const isDark = colors.text === '#ffffff'
  const cardBg = isDark ? '#1c1c1e' : '#ffffff'
  const borderColor = isDark ? '#2c2c2e' : '#e5e5ea'
  const isCelebration = data.type === 'celebration'

  return (
    <View className="absolute inset-0 z-[9998] items-center justify-center" pointerEvents="box-none">
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
        className="mx-6 w-full max-w-sm rounded-2xl px-6 py-6"
        style={[
          {
            backgroundColor: cardBg,
            borderWidth: 1,
            borderColor: isCelebration ? '#ffd60a' : borderColor,
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
        {/* Dismiss X */}
        <Pressable
          className="absolute top-3 right-3 p-1 active:opacity-50"
          onPress={dismiss}
          hitSlop={12}
        >
          <IconX size={18} color={colors.muted} />
        </Pressable>

        {/* Icon */}
        <View className="items-center mb-4">
          {isCelebration ? (
            <Text className="text-4xl">🎉</Text>
          ) : (
            <View
              className="w-14 h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: `${colors.accent}15` }}
            >
              <CreditIcon size={28} color={colors.accent} />
            </View>
          )}
        </View>

        {/* Title */}
        <Text className="text-lg font-bold text-text text-center mb-2">
          {data.title}
        </Text>

        {/* Message */}
        <Text className="text-sm text-muted text-center leading-5 mb-2">
          {data.message}
        </Text>

        {/* Action button */}
        {data.type === 'action' && (
          <Pressable
            className="rounded-xl py-3.5 items-center active:opacity-80 mt-4"
            style={{ backgroundColor: colors.accent }}
            onPress={() => {
              const route = data.route
              dismiss()
              setTimeout(() => router.push(route as any), 300)
            }}
          >
            <Text className="text-base font-semibold" style={{ color: '#1c1c1e' }}>
              {data.actionLabel}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  )
}
