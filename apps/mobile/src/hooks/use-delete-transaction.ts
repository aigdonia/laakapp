import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'

import { userDb, transactions } from '@/src/db'
import { refreshAggregationEngine } from '@/src/db/duckdb'

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await userDb.delete(transactions).where(eq(transactions.id, id))
    },
    onSuccess: () => {
      refreshAggregationEngine()
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
    },
  })
}
