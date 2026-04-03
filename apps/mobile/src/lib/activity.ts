import { createMMKV } from 'react-native-mmkv'

import { api } from './api'
import { useCredits } from '@/src/store/credits'
import { triggerConfetti } from '@/src/components/confetti-overlay'
import { showActivityToast } from '@/src/components/activity-toast'
import { showCelebration } from '@/src/components/credits-alert'
import { showLearningCard } from '@/src/components/learning-card-overlay'
import { showMicroLesson } from '@/src/components/micro-lesson-sheet'
import type { ReportEventResponse, TriggeredAction } from '@fin-ai/shared'

const unlockedFeatures = createMMKV({ id: 'unlocked-features' })

/** Replace {{key}} and {{_event.key}} placeholders with payload values */
function interpolate(template: string, payload: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path: string) => {
    const parts = path.split('.')
    let value: unknown = payload
    for (const part of parts) {
      if (value == null || typeof value !== 'object') return match
      value = (value as Record<string, unknown>)[part]
    }
    return value != null ? String(value) : match
  })
}

/** Execute a triggered action (confetti, cards, toasts, etc). Also used by dev test poll. */
export async function executeTestAction(action: { actionType: string; payload: Record<string, unknown> }) {
  return handleAction(action as TriggeredAction)
}

async function handleAction(action: TriggeredAction) {
  const { actionType, payload } = action

  switch (actionType) {
    case 'reward_credits': {
      await useCredits.getState().refreshBalance()
      triggerConfetti()
      showCelebration({
        title: `+${payload.amount} LAK`,
        message: interpolate((payload.message as string) || 'You earned credits!', payload),
        timeout: (payload.timeout as number) ?? 3000,
      })
      break
    }

    case 'show_confetti': {
      triggerConfetti()
      showCelebration({
        title: interpolate((payload.title as string) || 'Milestone!', payload),
        message: interpolate((payload.message as string) || '', payload),
        timeout: (payload.timeout as number) ?? 3000,
      })
      break
    }

    case 'show_toast': {
      showActivityToast({
        type: 'info',
        title: interpolate((payload.title as string) || '', payload),
        message: interpolate((payload.message as string) || '', payload),
      })
      break
    }

    case 'show_micro_lesson': {
      const lessonId = payload.lessonId as string
      if (lessonId) {
        try {
          const lesson = await api.get<{ title: string; content: string }>(`/micro-lessons/${lessonId}`)
          showMicroLesson({
            title: interpolate(lesson.title, payload),
            body: interpolate(lesson.content, payload),
          })
        } catch {
          // Lesson fetch failed — skip silently
        }
      }
      break
    }

    case 'show_learning_card': {
      const cardId = payload.cardId as string
      if (cardId) {
        try {
          const card = await api.get<{ title: string; content: string; imageUrl?: string }>(`/learning-cards/${cardId}`)
          showLearningCard({
            title: interpolate(card.title, payload),
            body: interpolate(card.content, payload),
            imageUrl: card.imageUrl || undefined,
          })
        } catch {
          // Card fetch failed — skip silently
        }
      }
      break
    }

    case 'unlock_feature': {
      const featureKey = payload.featureKey as string
      if (featureKey) {
        unlockedFeatures.set(featureKey, true)
      }
      break
    }
  }
}

/**
 * Report a user activity event to the API.
 * Automatically handles triggered actions (confetti, toasts, credit rewards).
 * Silently returns empty on failure — never blocks the user.
 */
export async function reportEvent(
  eventType: string,
  metadata?: Record<string, unknown>,
  idempotencyKey?: string,
): Promise<ReportEventResponse> {
  try {
    const response = await api.post<ReportEventResponse>('/activity/events', {
      eventType,
      metadata,
      idempotencyKey,
    })

    if (__DEV__) {
      console.log(`[activity] ${eventType}`, {
        triggered: response.triggered.length,
        actions: response.triggered.map((a) => a.actionType),
        throttled: (response as any).throttled ?? false,
      })
    }

    for (const action of response.triggered) {
      await new Promise((r) => setTimeout(r, 300))
      await handleAction(action)
    }

    return response
  } catch (err) {
    if (__DEV__) {
      console.warn(`[activity] ${eventType} failed:`, err)
    }
    return { triggered: [] }
  }
}
