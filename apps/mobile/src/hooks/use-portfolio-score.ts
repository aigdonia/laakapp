import { useMemo } from 'react'
import type { AssetClass } from '@fin-ai/shared'
import type { HoldingGroup } from './use-holdings'
import type { ClassContribution, PortfolioScore } from '@/src/types/insights'
import { getScoreZone } from '@/src/types/insights'

/** Default allocation when no preset is selected */
export const DEFAULT_ALLOCATIONS: Record<string, number> = { cash: 34, etf: 33, gold: 33 }

/**
 * Computes a Portfolio Health Score (0-100) based on asset class diversification.
 *
 * Uses preset allocations when selected, otherwise DEFAULT_ALLOCATIONS.
 * Each class contributes min(actualPct, idealPct) to the total score.
 * A perfectly diversified portfolio across all classes = 100.
 *
 * Uses cost basis (totalCostInBase) — the actual money spent — not market value.
 * Currency conversion is handled upstream.
 */
export function usePortfolioScore(
  groups: HoldingGroup[],
  assetClasses: AssetClass[] | undefined,
  presetAllocations?: Record<string, number> | null,
): PortfolioScore | null {
  return useMemo(() => {
    if (!assetClasses?.length || groups.length === 0) return null

    const totalValue = groups.reduce((sum, g) => sum + g.totalCostInBase, 0)
    if (totalValue === 0) return null

    const allocations = presetAllocations ?? DEFAULT_ALLOCATIONS

    // Only show classes defined in the allocations
    const relevantClasses = assetClasses.filter((ac) => ac.slug in allocations)

    if (relevantClasses.length === 0) return null

    // Build a map of actual percentages by slug
    const actualBySlug = new Map<string, number>()
    for (const g of groups) {
      const pct = (g.totalCostInBase / totalValue) * 100
      actualBySlug.set(g.type, pct)
    }

    // Compute per-class contribution
    const classes: ClassContribution[] = relevantClasses.map((ac) => {
      const actualPct = actualBySlug.get(ac.slug) ?? 0
      const idealPct = allocations[ac.slug] ?? 0
      return {
        slug: ac.slug,
        name: ac.name,
        color: ac.color,
        actualPct: Math.round(actualPct * 10) / 10,
        idealPct: Math.round(idealPct * 10) / 10,
        contribution: Math.round(Math.min(actualPct, idealPct) * 10) / 10,
      }
    })

    const total = Math.round(classes.reduce((sum, c) => sum + c.contribution, 0))

    return {
      total,
      zone: getScoreZone(total),
      classes,
    }
  }, [groups, assetClasses, presetAllocations])
}
