import { getPostHog } from './posthog'

type Properties = Record<string, string | number | boolean | null | undefined>

export function track(event: string, properties?: Properties) {
  getPostHog()?.capture(event, properties as any)
}
