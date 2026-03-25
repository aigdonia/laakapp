import { useMemo } from 'react'
import type { AssetClass } from '@fin-ai/shared'
import type { HoldingGroup } from './use-holdings'
import type { ClassContribution, PortfolioScore } from '@/src/types/insights'
import { getScoreZone } from '@/src/types/insights'

/**
 * Computes a Portfolio Health Score (0-100) based on asset class diversification.
 *
 * All available asset classes share equal ideal weight (100 / numClasses).
 * Each class contributes min(actualPct, idealPct) to the total score.
 * A perfectly diversified portfolio across all classes = 100.
 *
 * Currency conversion is ignored — all values treated as-is.
 */
export function usePortfolioScore(
  groups: HoldingGroup[],
  assetClasses: AssetClass[] | undefined,
): PortfolioScore | null {
  return useMemo(() => {
    if (!assetClasses?.length || groups.length === 0) return null

    const totalValue = groups.reduce((sum, g) => sum + g.totalValue, 0)
    if (totalValue === 0) return null

    const idealPct = 100 / assetClasses.length

    // Build a map of actual percentages by slug
    const actualBySlug = new Map<string, number>()
    for (const g of groups) {
      const pct = (g.totalValue / totalValue) * 100
      actualBySlug.set(g.type, pct)
    }

    // Compute per-class contribution
    const classes: ClassContribution[] = assetClasses.map((ac) => {
      const actualPct = actualBySlug.get(ac.slug) ?? 0
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
  }, [groups, assetClasses])
}
