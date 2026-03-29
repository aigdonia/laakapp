import { useEffect, useCallback, useState } from 'react'
import { Text, View, Pressable, useColorScheme, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const TOAST_WIDTH = SCREEN_WIDTH - 32

export type ToastType = 'reward' | 'info' | 'confetti'

export type ToastData = {
  id: string
  type: ToastType
  title: string
  message: string
}

type QueueItem = ToastData

let showToastFn: ((data: ToastData) => void) | null = null

/** Show a toast from anywhere (non-React context) */
export function showActivityToast(data: Omit<ToastData, 'id'>) {
  showToastFn?.({ ...data, id: Date.now().toString() })
}

/**
 * Toast overlay — mount once in root layout.
 * Slides in from top, auto-dismisses after 3s.
 */
export function ActivityToastOverlay() {
  const isDark = useColorScheme() === 'dark'
  const insets = useSafeAreaInsets()
  const [current, setCurrent] = useState<QueueItem | null>(null)
  const [queue, setQueue] = useState<QueueItem[]>([])

  const translateY = useSharedValue(-120)
  const opacity = useSharedValue(0)

  const dismiss = useCallback(() => {
    translateY.value = withTiming(-120, { duration: 250, easing: Easing.in(Easing.ease) })
    opacity.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(setCurrent)(null)
    })
  }, [])

  // Process queue
  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue
      setCurrent(next)
      setQueue(rest)
    }
  }, [current, queue])

  // Animate in when current changes
  useEffect(() => {
    if (!current) return

    if (current.type === 'reward') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    translateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.back(1.2)) })
    opacity.value = withTiming(1, { duration: 300 })

    // Auto-dismiss after 3.5s
    const timer = setTimeout(dismiss, 3500)
    return () => clearTimeout(timer)
  }, [current])

  // Register global show function
  useEffect(() => {
    showToastFn = (data) => setQueue((q) => [...q, data])
    return () => { showToastFn = null }
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  if (!current) return null

  const bgColor = current.type === 'reward'
    ? (isDark ? '#2d1f00' : '#fff8e1')
    : (isDark ? '#2c2c2e' : '#ffffff')
  const borderColor = current.type === 'reward'
    ? '#ffd60a'
    : (isDark ? '#3a3a3c' : '#e5e5ea')
  const titleColor = current.type === 'reward'
    ? '#ffd60a'
    : (isDark ? '#ffffff' : '#1c1c1e')
  const messageColor = isDark ? '#aeaeb2' : '#636366'

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: insets.top + 8,
          left: 16,
          width: TOAST_WIDTH,
          zIndex: 9999,
        },
        animatedStyle,
      ]}
      pointerEvents="box-none"
    >
      <Pressable onPress={dismiss}>
        <View
          style={{
            backgroundColor: bgColor,
            borderWidth: 1,
            borderColor,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 0.12,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text
            style={{
              color: titleColor,
              fontSize: 15,
              fontWeight: '700',
              marginBottom: current.message ? 2 : 0,
            }}
          >
            {current.title}
          </Text>
          {current.message ? (
            <Text style={{ color: messageColor, fontSize: 13, lineHeight: 18 }}>
              {current.message}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  )
}
