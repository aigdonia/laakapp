import { useCallback } from 'react'
import { Tabs, router, usePathname } from 'expo-router'
import { I18nManager } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useTranslation } from 'react-i18next'

import { AppHeader } from '@/src/components/app-header'
import { usePreferences } from '@/src/store/preferences'
import { TabSwipeProvider, useTabSwipe } from '@/src/components/tab-swipe-context'
import { AnimatedTabBar } from '@/src/components/animated-tab-bar'
import {
  IconLayoutDashboardFilled,
  IconChartPieFilled,
  IconBookFilled,
  IconSettingsFilled,
} from '@tabler/icons-react-native'

const TAB_ORDER = ['portfolio', 'index', 'learn', 'settings'] as const
type TabName = (typeof TAB_ORDER)[number]

const SWIPE_THRESHOLD = 50
const VELOCITY_THRESHOLD = 500
const MAX_PAN = 120

function getTabRoute(tab: TabName) {
  if (tab === 'index') return '/(tabs)' as const
  return `/(tabs)/${tab}` as const
}

function TabLayoutInner() {
  const { t } = useTranslation()
  const swipeEnabled = usePreferences((s) => s.swipeNavigation)
  const pathname = usePathname()
  const { progress, activeIndex, bounceTarget } = useTabSwipe()
  const isRTL = I18nManager.isRTL

  const currentTab = (pathname.replace('/', '') || 'index') as TabName
  const currentIndex = TAB_ORDER.indexOf(currentTab)

  // Keep activeIndex in sync with route changes (e.g. tab taps)
  if (currentIndex >= 0 && activeIndex.value !== currentIndex) {
    activeIndex.value = currentIndex
  }

  const navigateToTab = useCallback(
    (tab: TabName, swipeIdx: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      bounceTarget.value = swipeIdx
      activeIndex.value = swipeIdx
      router.navigate(getTabRoute(tab))
    },
    [activeIndex, bounceTarget],
  )

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-30, 30])
    .failOffsetY([-15, 15])
    .enabled(swipeEnabled && currentIndex >= 0)
    .onUpdate((event) => {
      // Normalize progress: -1 (swiped left/forward) to +1 (swiped right/back)
      const raw = event.translationX / MAX_PAN
      const clamped = Math.max(-1, Math.min(1, raw))
      progress.value = isRTL ? -clamped : clamped
    })
    .onEnd((event) => {
      const { velocityX, translationX } = event
      const tx = isRTL ? -translationX : translationX
      const vx = isRTL ? -velocityX : velocityX

      const isForward = tx < -SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD
      const isBack = tx > SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD

      if (isForward && currentIndex < TAB_ORDER.length - 1) {
        navigateToTab(TAB_ORDER[currentIndex + 1], currentIndex + 1)
      } else if (isBack && currentIndex > 0) {
        navigateToTab(TAB_ORDER[currentIndex - 1], currentIndex - 1)
      }

      progress.value = 0
    })
    .onFinalize(() => {
      progress.value = 0
    })
    .runOnJS(true)

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View style={{ flex: 1 }}>
        <Tabs
          tabBar={(props) => <AnimatedTabBar {...props} />}
          screenOptions={{
            header: () => <AppHeader />,
            headerStatusBarHeight: 0,
          }}
        >
          <Tabs.Screen
            name="portfolio"
            options={{
              title: t('portfolio:title'),
              tabBarIcon: ({ color }) => (
                <IconChartPieFilled size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              title: t('insights:title'),
              tabBarIcon: ({ color }) => (
                <IconLayoutDashboardFilled size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="add"
            options={{ title: '' }}
          />
          <Tabs.Screen
            name="learn"
            options={{
              title: t('learn:title'),
              tabBarIcon: ({ color }) => (
                <IconBookFilled size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: t('settings:title'),
              tabBarIcon: ({ color }) => (
                <IconSettingsFilled size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </Animated.View>
    </GestureDetector>
  )
}

export default function TabLayout() {
  return (
    <TabSwipeProvider>
      <TabLayoutInner />
    </TabSwipeProvider>
  )
}
