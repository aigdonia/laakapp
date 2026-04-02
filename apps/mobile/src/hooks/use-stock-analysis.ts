import { useCallback, useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'

import { api, ApiError } from '@/src/lib/api'
import { useCredits } from '@/src/store/credits'
import { track } from '@/src/lib/analytics'
import { userDb } from '@/src/db/user-db'
import { aiAnalyses } from '@/src/db/user-schema'

const CREDIT_COST = 2

type FriendResponse = {
  result: {
    personalizedIntro: string
    stockAnalysis: string
    version: number
  }
  balance: number
  transactionId: string | null
}

type ServerVersionResponse = {
  version: number
  content: string
  updatedAt: string
}

type CachedAnalysis = {
  personalizedIntro: string
  stockAnalysis: string
  version: number
}

type StockAnalysisState = {
  analysis: CachedAnalysis | null
  isStale: boolean
  isLoading: boolean
  error: string | null
  generate: () => Promise<void>
}

export function useStockAnalysis(
  holdingKey: string,
  symbol: string | null,
  assetType: string,
  userContext: {
    quantity: number
    totalCost: number
    avgCost: number
    gainLoss: number | null
    gainLossPct: number | null
    currency: string
  },
  language: string,
): StockAnalysisState {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<CachedAnalysis | null>(null)
  const [isStale, setIsStale] = useState(false)

  // Load cached analysis from userDb
  useEffect(() => {
    const rows = userDb
      .select()
      .from(aiAnalyses)
      .where(eq(aiAnalyses.holdingKey, holdingKey))
      .all()

    if (rows.length > 0) {
      const row = rows[0]
      try {
        const parsed = JSON.parse(row.content) as CachedAnalysis
        setAnalysis(parsed)

        // Check if server has newer version
        if (symbol) {
          checkServerVersion(symbol, parsed.version, language)
        }
      } catch {
        // Invalid cache, ignore
      }
    }
  }, [holdingKey, symbol, language])

  const checkServerVersion = async (sym: string, cachedVersion: number, lang: string) => {
    try {
      const server = await api.get<ServerVersionResponse>(
        `/stock-analysis/${sym}?lang=${lang}`,
      )
      if (server.version > cachedVersion) {
        setIsStale(true)
      }
    } catch {
      // Server might not have this stock yet — not an error
    }
  }

  const generate = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    setError(null)

    try {
      // Fetch batch analysis from server if available (for equities)
      let stockAnalysisContent = ''
      let serverVersion = 1

      if (symbol && (assetType === 'stock' || assetType === 'etf')) {
        try {
          const server = await api.get<ServerVersionResponse>(
            `/stock-analysis/${symbol}?lang=${language}`,
          )
          stockAnalysisContent = server.content
          serverVersion = server.version
        } catch (err) {
          // No batch analysis available — will generate fully real-time
          if (err instanceof ApiError && err.status !== 404) throw err
        }
      }

      const response = await api.post<FriendResponse>('/friend', {
        feature: 'stock_deepdive',
        language,
        payload: {
          symbol,
          holdingKey,
          assetType,
          userContext,
          stockAnalysis: stockAnalysisContent,
          version: serverVersion,
        },
      })

      const result = response.result

      // Cache in userDb
      const id = `deepdive:${holdingKey}`
      const content = JSON.stringify(result)

      const existing = userDb
        .select()
        .from(aiAnalyses)
        .where(eq(aiAnalyses.id, id))
        .all()

      if (existing.length > 0) {
        userDb
          .update(aiAnalyses)
          .set({
            content,
            version: result.version,
            creditTransactionId: response.transactionId,
            createdAt: new Date(),
          })
          .where(eq(aiAnalyses.id, id))
          .run()
      } else {
        userDb
          .insert(aiAnalyses)
          .values({
            id,
            holdingKey,
            type: 'stock_deepdive',
            content,
            version: result.version,
            creditTransactionId: response.transactionId,
          })
          .run()
      }

      setAnalysis(result)
      setIsStale(false)
      useCredits.setState({ balance: response.balance })
      track('stock_deepdive_generated', { assetType, symbol })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [holdingKey, symbol, assetType, userContext, language, isLoading])

  return { analysis, isStale, isLoading, error, generate }
}

export { CREDIT_COST as STOCK_DEEPDIVE_COST }
