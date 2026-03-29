import { api } from './api'
import type { ReportEventResponse } from '@fin-ai/shared'

/**
 * Report a user activity event to the API.
 * Returns triggered actions (rewards, lessons, toasts, etc).
 * Silently returns empty on failure — never blocks the user.
 */
export async function reportEvent(
  eventType: string,
  metadata?: Record<string, unknown>,
  idempotencyKey?: string,
): Promise<ReportEventResponse> {
  try {
    return await api.post<ReportEventResponse>('/activity/events', {
      eventType,
      metadata,
      idempotencyKey,
    })
  } catch {
    return { triggered: [] }
  }
}
