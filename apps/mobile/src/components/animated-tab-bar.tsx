import { useCallback } from 'react'
import { Pressable, View, Text, Platform, I18nManager, type LayoutChangeEvent } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useThemeColors } from '@/src/theme/colors'
import { useTabSwipe } from './tab-swipe-context'
import { IconPlus } from '@tabler/icons-react-native'

/**
 * Maps the 5 tab-bar slots to swipeable-order indices.
 * Slot 2 is the "add" button (not swipeable) → -1.
 */
const SLOT_TO_SWIPE = [0, 1, -1, 2, 3] as const
const SWIPE_TO_SLOT = [0, 1, 3, 4] as const
const TOTAL_SLOTS = 5

const SPRING = { damping: 18, stiffness: 280, mass: 0.6 }
const INDICATOR_PADDING = 6

function BouncingIcon({
  slotIndex,
  children,
}: {
  slotIndex: number
  children: React.ReactNode
}) {
  const { bounceTarget } = useTabSwipe()
  const swipeIdx = SLOT_TO_SWIPE[slotIndex]
  const scale = useSharedValue(1)

  useAnimatedReaction(
    () => bounceTarget.value,
    (current) => {
      if (current === swipeIdx && swipeIdx >= 0) {
        scale.value = 1.25
        scale.value = withSpring(1, { damping: 8, stiffness: 400, mass: 0.5 }, () => {
          if (bounceTarget.value === swipeIdx) bounceTarget.value = -1
        })
      }
    },
  )

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return <Animated.View style={style}>{children}</Animated.View>
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: any) {
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const { progress, activeIndex } = useTabSwipe()
  const isRTL = I18nManager.isRTL
  const barWidth = useSharedValue(0)

  const onBarLayout = useCallback((e: LayoutChangeEvent) => {
    barWidth.value = e.nativeEvent.layout.width
  }, [barWidth])

  // Animated slot position — springs on tab change for smooth slide
  const indicatorSlot = useSharedValue<number>(SWIPE_TO_SLOT[0])

  useAnimatedReaction(
    () => activeIndex.value,
    (idx) => {
      indicatorSlot.value = withSpring(SWIPE_TO_SLOT[idx] ?? 0, SPRING)
    },
  )

  // Rounded background indicator behind the active tab
  const indicatorBorder = `rgba(255, 214, 10, 0.35)`

  const indicatorStyle = useAnimatedStyle(() => {
    const w = barWidth.value
    if (w === 0) {
      return { position: 'absolute' as const, opacity: 0 }
    }

    const slotPx = w / TOTAL_SLOTS
    const absProgress = Math.abs(progress.value)

    // Rest position from the springing slot value
    const restLeft = indicatorSlot.value * slotPx + INDICATOR_PADDING

    // During swipe: stretch toward target
    const rawDir = progress.value < 0 ? 1 : -1
    const dir = isRTL ? -rawDir : rawDir
    const nextSwipeIdx = Math.max(0, Math.min(SWIPE_TO_SLOT.length - 1, activeIndex.value + dir))
    const targetSlot = SWIPE_TO_SLOT[nextSwipeIdx] ?? SWIPE_TO_SLOT[activeIndex.value]
    const targetLeft = targetSlot * slotPx + INDICATOR_PADDING

    const minLeft = Math.min(restLeft, targetLeft)
    const maxLeft = Math.max(restLeft, targetLeft)

    const restWidth = slotPx - INDICATOR_PADDING * 2
    const left = interpolate(absProgress, [0, 1], [restLeft, minLeft])
    const width = interpolate(
      absProgress,
      [0, 1],
      [restWidth, maxLeft - minLeft + restWidth],
    )

    return {
      position: 'absolute' as const,
      top: INDICATOR_PADDING,
      bottom: INDICATOR_PADDING,
      borderRadius: 16,
      left,
      width,
      opacity: interpolate(absProgress, [0, 0.1, 1], [0, 1, 1]),
    }
  })

  return (
    <View
      onLayout={onBarLayout}
      style={{
        position: 'absolute',
        bottom: Platform.OS === 'android' ? Math.max(24, insets.bottom + 8) : 24,
        left: 16,
        right: 16,
        borderRadius: 24,
        height: 64,
        backgroundColor: colors.tabBar,
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
          },
          android: { elevation: 8 },
        }),
      }}
    >
      {/* Rounded background indicator */}
      <Animated.View
        style={[
          {
            borderWidth: 1.5,
            borderColor: indicatorBorder,
          },
          indicatorStyle,
        ]}
        pointerEvents="none"
      />

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key]
        const isActive = state.index === index
        const isAdd = route.name === 'add'

        if (isAdd) {
          return (
            <Pressable
              key={route.key}
              className="flex-1 items-center justify-center"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                router.push('/add-holding')
              }}
            >
              <View
                className="w-14 h-14 rounded-full bg-accent items-center justify-center shadow-lg shadow-accent/40"
                style={{ marginBottom: '30%' }}
              >
                <IconPlus size={28} color="#1c1c1e" strokeWidth={3} />
              </View>
            </Pressable>
          )
        }

        const icon = options.tabBarIcon?.({
          focused: isActive,
          color: isActive ? colors.accent : colors.tabInactive,
          size: 22,
        })

        const label = options.title ?? route.name

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : undefined}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            className="flex-1 items-center justify-center gap-0.5"
            style={{ paddingVertical: 8 }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })
              if (!event.defaultPrevented && !isActive) {
                navigation.navigate(route.name)
                const swipeIdx = SLOT_TO_SWIPE[index]
                if (swipeIdx >= 0) activeIndex.value = swipeIdx
              }
            }}
          >
            <BouncingIcon slotIndex={index}>
              {icon}
            </BouncingIcon>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 10,
                fontWeight: '500',
                color: isActive ? colors.accent : colors.tabInactive,
              }}
            >
              {label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
