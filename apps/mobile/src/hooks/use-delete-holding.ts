import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sql } from 'drizzle-orm'

import { userDb } from '@/src/db'
import { refreshAggregationEngine } from '@/src/db/duckdb'
import { buildDeleteHoldingConditions } from '@/src/db/aggregation-queries'

export function useDeleteHolding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (holdingKey: string) => {
      const conditions = buildDeleteHoldingConditions(holdingKey)
      await userDb.run(sql.raw(`DELETE FROM transactions WHERE ${conditions}`))
    },
    onSuccess: () => {
      refreshAggregationEngine()
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
    },
  })
}
