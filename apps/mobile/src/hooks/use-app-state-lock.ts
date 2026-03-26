import { useEffect, useRef } from 'react'
import { AppState } from 'react-native'

import { usePreferences } from '@/src/store/preferences'
import { useAppLock } from '@/src/store/app-lock'

export function useAppStateLock(): void {
  const appLockEnabled = usePreferences((s) => s.appLockEnabled)
  const lockTimeout = usePreferences((s) => s.lockTimeout)
  const lock = useAppLock((s) => s.lock)
  const backgroundedAt = useRef<number | null>(null)

  // Lock on app launch
  useEffect(() => {
    if (appLockEnabled) lock()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Lock on return from background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (!appLockEnabled) return

      if (state === 'background') {
        backgroundedAt.current = Date.now()
      } else if (state === 'active' && backgroundedAt.current !== null) {
        const elapsed = backgroundedAt.current
          ? (Date.now() - backgroundedAt.current) / 1000
          : Infinity
        backgroundedAt.current = null

        if (elapsed >= lockTimeout) {
          lock()
        }
      }
    })

    return () => sub.remove()
  }, [appLockEnabled, lockTimeout, lock])
}
