import { useCallback, useState } from 'react'
import { createMMKV } from 'react-native-mmkv'

import { api } from '@/src/lib/api'
import { useCredits } from '@/src/store/credits'
import { track } from '@/src/lib/analytics'
import type { NarrativeData } from '@/src/types/insights'
import type { EnrichedHolding } from '@/src/types/holdings'
import type { ComplianceSummary } from '@/src/types/insights'

const mmkv = createMMKV({ id: 'narrative-cache' })

const CACHE_KEY = 'surface-narrative'

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

type NarrativeState = {
  narrative: NarrativeData | null
  isFirstTime: boolean
  isStale: boolean
  isLoading: boolean
  error: string | null
  generate: () => Promise<void>
  creditCost: number
}

export function useNarrative(
  holdings: EnrichedHolding[],
  compliance: ComplianceSummary,
  portfolioHash: string,
  language: string,
  featureConfig?: { creditCost: number; freeRefresh: boolean; enabled: boolean },
): NarrativeState {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [narrative, setNarrative] = useState<NarrativeData | null>(() => {
    const cached = getCached()
    return cached ?? null
  })

  const cached = getCached()
  const isFirstTime = !cached
  const isStale = !!cached && cached.portfolioHash !== portfolioHash
  const baseCost = featureConfig?.creditCost ?? 1
  const creditCost = isFirstTime ? baseCost : 0

  const generate = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    setError(null)

    try {
      // Build rich summary payload — no raw data, just aggregated insights
      const totalValue = holdings.reduce((sum, h) => sum + (h.marketValue ?? h.totalCost), 0)
      const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0)
      const gainLossPct = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0

      // Asset class breakdown
      const classMap = new Map<string, number>()
      for (const h of holdings) {
        const cls = h.assetType
        classMap.set(cls, (classMap.get(cls) ?? 0) + (h.marketValue ?? h.totalCost))
      }
      const classes = Array.from(classMap.entries())
        .map(([name, value]) => ({ name, pct: Math.round((value / totalValue) * 100) }))
        .sort((a, b) => b.pct - a.pct)

      // Top holdings by weight
      const top = [...holdings]
        .sort((a, b) => (b.marketValue ?? b.totalCost) - (a.marketValue ?? a.totalCost))
        .slice(0, 5)
        .map((h) => ({
          symbol: h.symbol ?? h.name ?? h.assetType,
          pct: Math.round(((h.marketValue ?? h.totalCost) / totalValue) * 100),
          gainPct: h.gainLossPct != null ? Math.round(h.gainLossPct * 10) / 10 : null,
        }))

      const isRefresh = !isFirstTime
      const response = await api.post<FriendResponse>('/friend', {
        feature: 'narrative',
        language,
        payload: {
          baseCurrency: holdings[0]?.currency ?? 'USD',
          gainLossPct: Math.round(gainLossPct * 10) / 10,
          classes,
          top,
          compliance,
          isRefresh,
        },
      })

      const data: NarrativeData = {
        ...(response.result as Omit<NarrativeData, 'generatedAt' | 'portfolioHash'>),
        generatedAt: Date.now(),
        portfolioHash,
      }

      setCache(data)
      setNarrative(data)

      // Update credit balance from response
      useCredits.setState({ balance: response.balance })

      track('narrative_generated', { isRefresh, creditCost })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [holdings, compliance, portfolioHash, language, isFirstTime, isLoading, creditCost])

  return { narrative, isFirstTime, isStale, isLoading, error, generate, creditCost }
}
