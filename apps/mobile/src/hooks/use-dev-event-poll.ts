import { useEffect, useRef } from 'react'
import { api } from '@/src/lib/api'
import { executeTestAction } from '@/src/lib/activity'

type PendingAction = {
  actionType: string
  payload: Record<string, unknown>
}

type PollResponse = {
  actions: PendingAction[]
}

/**
 * Dev-only hook that polls for test actions pushed from admin.
 * Executes them directly through the action handler (confetti, cards, sheets, etc).
 */
export function useDevEventPoll() {
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!__DEV__) return

    async function poll() {
      try {
        const { actions } = await api.get<PollResponse>('/test-actions/pending')
        for (const action of actions) {
          console.log(`[dev-poll] Test action: ${action.actionType}`, action.payload)
          await executeTestAction(action)
        }
      } catch {
        // Silent
      }
    }

    interval.current = setInterval(poll, 3000)
    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [])
}
