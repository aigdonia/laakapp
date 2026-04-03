import { useCallback } from 'react'
import { createMMKV } from 'react-native-mmkv'

import { reportEvent } from '@/src/lib/activity'

const mmkv = createMMKV({ id: 'unlocked-features' })

/** Check if a feature has been unlocked via activity rules */
export function isFeatureUnlocked(featureKey: string): boolean {
  return mmkv.getBoolean(featureKey) ?? false
}

/**
 * Hook wrapper around reportEvent for components that prefer hook syntax.
 * All action handling (confetti, toasts, credits) is done inside reportEvent itself.
 */
export function useActivityEvent() {
  const report = useCallback(
    async (
      eventType: string,
      metadata?: Record<string, unknown>,
      idempotencyKey?: string,
    ) => {
      await reportEvent(eventType, metadata, idempotencyKey)
    },
    [],
  )

  return { report }
}
