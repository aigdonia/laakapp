import { PostHogProvider as PHProvider, usePostHog } from 'posthog-react-native'
import type { PostHog } from 'posthog-react-native'
import { useEffect } from 'react'

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? ''
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

/** Module-level ref for use outside React tree (hooks, stores, utils) */
let _posthog: PostHog | null = null
export function getPostHog() { return _posthog }

function Capture({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog()
  useEffect(() => { _posthog = posthog }, [posthog])
  return <>{children}</>
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!POSTHOG_API_KEY) return <>{children}</>

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
