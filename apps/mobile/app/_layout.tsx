import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as ScreenCapture from 'expo-screen-capture'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import '@/src/i18n'
import '@/src/global.css'
import { initAppDb, useUserDbMigrations } from '@/src/db'
import { queryClient } from '@/src/lib/query-client'
import { prefetchAppData } from '@/src/lib/prefetch'
import { SplashView } from '@/src/components/splash-view'
import { LockScreen } from '@/src/components/app-lock/lock-screen'
import { useAppStateLock } from '@/src/hooks/use-app-state-lock'
import { migrateFromSecureStore, applyThemePreference } from '@/src/store/preferences'
import { initPurchases } from '@/src/lib/purchases'
import { PostHogProvider } from '@/src/lib/posthog'
import { useCredits } from '@/src/store/credits'
import { useOnboarding } from '@/src/store/onboarding'
import { useOnboardingScreens } from '@/src/hooks/use-onboarding-screens'
import { registerForPushNotifications, setupNotificationListeners } from '@/src/lib/notifications'
import { useNotificationStore } from '@/src/store/notifications'
import { getOrCreateUUID } from '@/src/lib/uuid'
import { usePostHog } from 'posthog-react-native'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

SplashScreen.preventAutoHideAsync()
initAppDb()
migrateFromSecureStore()
applyThemePreference()

export default function RootLayout() {
  return (
    <PostHogProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutInner />
      </QueryClientProvider>
    </PostHogProvider>
  )
}

function RootLayoutInner() {
  ScreenCapture.usePreventScreenCapture()
  useAppStateLock()
  const colorScheme = useColorScheme()
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })
  const { success: migrated, error: migrationError } = useUserDbMigrations()
  const [progress, setProgress] = useState(0)
  const [dataReady, setDataReady] = useState(false)

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (migrationError) console.error('Migration failed:', migrationError)
  }, [migrationError])

  useEffect(() => {
    if (loaded && migrated) {
      prefetchAppData(setProgress).then(() => setDataReady(true))
      initPurchases().then(() => useCredits.getState().refreshBalance())
    }
  }, [loaded, migrated])

  useEffect(() => {
    if (loaded && migrated) {
      SplashScreen.hideAsync()
    }
  }, [loaded, migrated])

  // Register push notifications & identify with PostHog once data is ready
  const posthog = usePostHog()
  useEffect(() => {
    if (!dataReady) return

    const register = async () => {
      const userId = await getOrCreateUUID()
      posthog?.identify(userId)
      const token = await registerForPushNotifications(userId)
      if (token) {
        useNotificationStore.getState().setExpoToken(token)
        useNotificationStore.getState().setPermissionGranted(true)
      }
    }
    register()

    return setupNotificationListeners()
  }, [dataReady, posthog])

  const router = useRouter()
  const onboardingCompleted = useOnboarding((s) => s.completed)
  const { data: onboardingScreens } = useOnboardingScreens()

  useEffect(() => {
    if (dataReady && !onboardingCompleted && onboardingScreens && onboardingScreens.length > 0) {
      router.replace('/onboarding')
    }
  }, [dataReady, onboardingCompleted, onboardingScreens, router])

  if (!loaded || !migrated || !dataReady) {
    return <SplashView progress={progress} />
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal', headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="add-holding" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="holding/[id]" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="stock/[symbol]" options={{ title: 'Stock Detail' }} />
            <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="article/[id]" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="credits" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="terms" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="privacy" options={{ presentation: 'modal', headerShown: false }} />
          </Stack>
        </BottomSheetModalProvider>
      </ThemeProvider>
      <LockScreen />
    </GestureHandlerRootView>
  )
}
