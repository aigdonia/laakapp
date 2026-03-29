import { useCallback } from 'react'
import { createMMKV } from 'react-native-mmkv'

import { reportEvent } from '@/src/lib/activity'
import { useCredits } from '@/src/store/credits'
import { showActivityToast } from '@/src/components/activity-toast'
import { triggerConfetti } from '@/src/components/confetti-overlay'
import type { TriggeredAction } from '@fin-ai/shared'

const mmkv = createMMKV({ id: 'unlocked-features' })

/** Check if a feature has been unlocked via activity rules */
export function isFeatureUnlocked(featureKey: string): boolean {
  return mmkv.getBoolean(featureKey) ?? false
}

/**
 * Hook that reports user activity events and executes triggered actions.
 *
 * Usage:
 *   const { report } = useActivityEvent()
 *   await report('holding_added', { symbol: 'AAPL' }, 'holding_added:abc123')
 */
export function useActivityEvent() {
  const refreshBalance = useCredits((s) => s.refreshBalance)

  const handleAction = useCallback(
    async (action: TriggeredAction) => {
      const { actionType, payload } = action

      switch (actionType) {
        case 'reward_credits': {
          await refreshBalance()
          triggerConfetti()
          showActivityToast({
            type: 'reward',
            title: `+${payload.amount} LAK`,
            message: (payload.message as string) || 'You earned credits!',
          })
          break
        }

        case 'show_micro_lesson': {
          // TODO: Open bottom sheet with lesson content when lesson detail sheet is built
          showActivityToast({
            type: 'info',
            title: 'Quick Lesson',
            message: 'A new lesson is ready for you.',
          })
          break
        }

        case 'show_learning_card': {
          // TODO: Open centered modal card overlay when learning card modal is built
          showActivityToast({
            type: 'info',
            title: 'Learning Card',
            message: 'You have a new learning card!',
          })
          break
        }

        case 'show_toast': {
          showActivityToast({
            type: 'info',
            title: (payload.title as string) || '',
            message: (payload.message as string) || '',
          })
          break
        }

        case 'show_confetti': {
          triggerConfetti()
          showActivityToast({
            type: 'reward',
            title: (payload.title as string) || 'Milestone!',
            message: (payload.message as string) || '',
          })
          break
        }

        case 'unlock_feature': {
          const featureKey = payload.featureKey as string
          if (featureKey) {
            mmkv.set(featureKey, true)
          }
          break
        }
      }
    },
    [refreshBalance],
  )

  const report = useCallback(
    async (
      eventType: string,
      metadata?: Record<string, unknown>,
      idempotencyKey?: string,
    ) => {
      const response = await reportEvent(eventType, metadata, idempotencyKey)

      for (const action of response.triggered) {
        // Small delay so the primary user action completes first visually
        await new Promise((r) => setTimeout(r, 300))
        await handleAction(action)
      }
    },
    [handleAction],
  )

  return { report }
}
