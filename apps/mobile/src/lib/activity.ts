import { api } from './api'
import { getAppUserID } from './purchases'
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
    const customerId = await getAppUserID()
    if (!customerId) return { triggered: [] }

    return await api.postWithHeaders<ReportEventResponse>(
      '/activity/events',
      { eventType, metadata, idempotencyKey },
      { 'X-RC-Customer-Id': customerId },
    )
  } catch {
    return { triggered: [] }
  }
}
