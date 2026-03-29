import { useQuery } from '@tanstack/react-query'
import type { StockComplianceLean } from '@fin-ai/shared'

import { api } from '@/src/lib/api'
import { appDb, cachedStockCompliance } from '@/src/db'

const STALE_24H = 1000 * 60 * 60 * 24

type ComplianceMap = Record<string, StockComplianceLean>

async function syncComplianceToCache(data: ComplianceMap, ruleSlug: string) {
  // Clear old entries for this rule
  await appDb.delete(cachedStockCompliance)
  const entries = Object.entries(data)
  if (entries.length > 0) {
    await appDb.insert(cachedStockCompliance).values(
      entries.map(([symbol, c]) => ({
        symbol,
        ruleSlug,
        status: c.status,
        layer: c.layer,
        ratios: JSON.stringify(c.ratios),
        fetchedAt: new Date(),
      })),
    )
  }
}

async function fetchOrCacheCompliance(
  symbols: string[],
  ruleSlug: string,
): Promise<ComplianceMap> {
  if (symbols.length === 0) return {}

  try {
    const data = await api.get<ComplianceMap>(
      `/stock-compliance/by-symbols?symbols=${symbols.join(',')}&ruleSlug=${ruleSlug}`,
    )
    await syncComplianceToCache(data, ruleSlug)
    return data
  } catch {
    const cached = await appDb.select().from(cachedStockCompliance)
    if (cached.length > 0) {
      const map: ComplianceMap = {}
      for (const row of cached) {
        map[row.symbol] = {
          status: row.status as StockComplianceLean['status'],
          layer: row.layer as StockComplianceLean['layer'],
          ratios: JSON.parse(row.ratios),
        }
      }
      return map
    }
    return {}
  }
}

export function useStockCompliance(symbols: string[], ruleSlug: string) {
  return useQuery({
    queryKey: ['stock-compliance', ruleSlug, symbols.sort().join(',')],
    staleTime: STALE_24H,
    queryFn: () => fetchOrCacheCompliance(symbols, ruleSlug),
    enabled: symbols.length > 0 && !!ruleSlug,
  })
}
