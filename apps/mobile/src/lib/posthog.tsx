import { PostHogProvider as PHProvider, usePostHog } from 'posthog-react-native'
import type { PostHog } from 'posthog-react-native'
import { useEffect } from 'react'
import { requestTrackingPermissionsAsync, getTrackingPermissionsAsync } from 'expo-tracking-transparency'
import { Platform } from 'react-native'

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? ''
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

/** Module-level ref for use outside React tree (hooks, stores, utils) */
let _posthog: PostHog | null = null
export function getPostHog() { return _posthog }

/** Request ATT permission and return whether tracking is allowed */
export async function requestTrackingConsent(): Promise<boolean> {
  if (Platform.OS !== 'ios') return true
  const { status } = await requestTrackingPermissionsAsync()
  return status === 'granted'
}

/** Check current ATT status without prompting */
export async function getTrackingConsent(): Promise<boolean> {
  if (Platform.OS !== 'ios') return true
  const { status } = await getTrackingPermissionsAsync()
  return status === 'granted'
}

function Capture({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog()
  useEffect(() => { _posthog = posthog }, [posthog])
  return <>{children}</>
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (__DEV__ || !POSTHOG_API_KEY) return <>{children}</>

  // Always mount PostHog so the instance is available.
  // ATT consent controls identify vs optOut in _layout.tsx.
  return (
    <PHProvider
      apiKey={POSTHOG_API_KEY}
      options={{
        host: POSTHOG_HOST,
        captureAppLifecycleEvents: true,
      }}
      autocapture={{
        captureScreens: true,
        captureTouches: false,
      }}
    >
      <Capture>{children}</Capture>
    </PHProvider>
  )
}
