import { useCallback, useState } from 'react'
import { createMMKV } from 'react-native-mmkv'

import { api } from '@/src/lib/api'
import { useCredits } from '@/src/store/credits'
import { track } from '@/src/lib/analytics'
import type { NarrativeData } from '@/src/types/insights'
import type { EnrichedHolding } from '@/src/types/holdings'
import type { ComplianceSummary } from '@/src/types/insights'

const mmkv = createMMKV({ id: 'deep-analysis-cache' })

const CACHE_KEY = 'deep-analysis'
const CREDIT_COST = 3

type FriendResponse = {
  result: NarrativeData
  balance: number
  transactionId: string | null
}

function getCached(): (NarrativeData & { portfolioHash: string }) | null {
  const raw = mmkv.getString(CACHE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setCache(data: NarrativeData) {
  mmkv.set(CACHE_KEY, JSON.stringify(data))
}

type DeepAnalysisState = {
  analysis: NarrativeData | null
  isStale: boolean
  isLoading: boolean
  error: string | null
  generate: () => Promise<void>
}

export function useDeepAnalysis(
  holdings: EnrichedHolding[],
  compliance: ComplianceSummary,
  complianceMap: Record<string, { status: string; ratios?: Record<string, number | null> }> | undefined,
  portfolioHash: string,
  score: { total: number } | null,
  language: string,
  featureConfig?: { creditCost: number; enabled: boolean },
): DeepAnalysisState {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<NarrativeData | null>(() => getCached())

  const cached = getCached()
  const isStale = !!cached && cached.portfolioHash !== portfolioHash

  const generate = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    setError(null)

    try {
      const holdingsPayload = holdings.map((h) => ({
        name: h.symbol ?? h.name ?? h.assetType,
        type: h.assetType,
        weight: h.totalCost,
        gainLossPct: h.gainLossPct,
      }))

      // Include compliance ratios for threshold proximity analysis
      const ratios = complianceMap
        ? Object.entries(complianceMap).map(([symbol, data]) => ({
            symbol,
            status: data.status,
            ratios: data.ratios,
          }))
        : []

      const response = await api.post<FriendResponse>('/friend', {
        feature: 'deep_analysis',
        language,
        payload: {
          holdings: holdingsPayload,
          compliance,
          ratios,
          score: score ? { total: score.total } : null,
        },
      })

      const data: NarrativeData = {
        ...(response.result as Omit<NarrativeData, 'generatedAt' | 'portfolioHash'>),
        generatedAt: Date.now(),
        portfolioHash,
      }

      setCache(data)
      setAnalysis(data)
      useCredits.setState({ balance: response.balance })
      track('deep_analysis_generated', {})
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [holdings, compliance, complianceMap, portfolioHash, score, language, isLoading])

  return { analysis, isStale, isLoading, error, generate }
}

export const DEFAULT_DEEP_ANALYSIS_COST = CREDIT_COST
