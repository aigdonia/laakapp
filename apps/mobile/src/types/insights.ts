import type { AssetType } from './holdings'

// --- Portfolio Health Score ---

export type ScoreZone = 'poor' | 'fair' | 'good' | 'excellent'

export interface ClassContribution {
  slug: string
  name: string
  color: string
  /** Actual percentage of portfolio (0-100) */
  actualPct: number
  /** Ideal target percentage (0-100), equal weight across all classes */
  idealPct: number
  /** Points contributed = min(actualPct, idealPct) */
  contribution: number
}

export interface HealthFactor {
  name: string
  score: number
  description: string
}

export interface PortfolioScore {
  total: number
  zone: ScoreZone
  /** Per-class breakdown: actual vs ideal allocation */
  classes: ClassContribution[]
}

// --- Sharia Compliance ---

export interface ComplianceSummary {
  compliant: number
  nonCompliant: number
  notScreened: number
  total: number
}

// --- AI Narrative ---

export interface NarrativeData {
  summary: string
  strengths: string[]
  improvements: string[]
  generatedAt: number
  portfolioHash: string
}

// --- Concentration ---

export interface ConcentrationInsight {
  topHolding: { name: string; percentage: number } | null
  segments: { label: string; percentage: number; color: string }[]
  verdict: string
}

// --- Learning Nudge ---

export interface LearningNudge {
  id: string
  titleKey: string
  descriptionKey: string
  /** Asset types that, when absent from portfolio, trigger this nudge */
  triggerWhenMissing: AssetType[]
}

// --- Helpers ---

export function getScoreZone(score: number): ScoreZone {
  if (score < 50) return 'poor'
  if (score < 75) return 'fair'
  if (score < 90) return 'good'
  return 'excellent'
}

export function getScoreLabel(zone: ScoreZone): string {
  return `zone_${zone}`
}

export function getScoreColor(zone: ScoreZone): string {
  switch (zone) {
    case 'poor': return '#ff3b30'       // status.negative
    case 'fair': return '#ff9500'       // status.review
    case 'good': return '#34c759'       // status.compliant
    case 'excellent': return '#34c759'  // status.compliant
  }
}
