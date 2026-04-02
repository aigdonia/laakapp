import { useMemo } from 'react'
import type { EnrichedHolding } from '@/src/types/holdings'

/**
 * Produces a stable hash string from holdings data.
 * Changes when portfolio composition changes (holdings added/removed, quantities change).
 */
export function usePortfolioHash(holdings: EnrichedHolding[]): string {
  return useMemo(() => {
    if (holdings.length === 0) return ''

    const parts = holdings
      .map((h) => `${h.holdingKey}:${h.totalQuantity}:${h.totalCost}`)
      .sort()
      .join('|')

    // Simple hash — good enough for change detection
    let hash = 0
    for (let i = 0; i < parts.length; i++) {
      const char = parts.charCodeAt(i)
      hash = ((hash << 5) - hash + char) | 0
    }
    return hash.toString(36)
  }, [holdings])
}
