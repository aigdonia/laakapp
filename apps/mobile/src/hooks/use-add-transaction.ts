import { useMutation, useQueryClient } from '@tanstack/react-query'
import { randomUUID } from 'expo-crypto'

import { userDb, transactions } from '@/src/db'
import { refreshAggregationEngine } from '@/src/db/duckdb'
import type { TransactionDraft } from '@/src/types/holdings'

function parseNumber(val: string): number {
  const n = parseFloat(val)
  return isNaN(n) ? 0 : n
}

export function useAddTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (draft: TransactionDraft) => {
      const id = randomUUID()
      const quantity = draft.assetType === 'real_estate' ? 1 : parseNumber(draft.quantity)
      const pricePerUnit = draft.assetType === 'cash' ? 1 : parseNumber(draft.costPerUnit)
      const now = new Date()
      const purchaseDate = draft.date ? new Date(draft.date) : now

      await userDb.insert(transactions).values({
        id,
        type: draft.transactionType,
        quantity,
        pricePerUnit,
        fees: draft.fees ? parseNumber(draft.fees) : 0,
        notes: draft.notes || null,
        date: purchaseDate,
        assetType: draft.assetType,
        symbol: draft.symbol || null,
        name: draft.name || draft.symbol || draft.assetType,
        exchange: draft.exchange || null,
        currency: draft.currency || 'EGP',
        unit: draft.unit || null,
        purity: draft.purity || null,
        profitRate: draft.profitRate ? parseNumber(draft.profitRate) : null,
        maturityDate: draft.maturityDate || null,
        estimatedValue: draft.estimatedValue ? parseNumber(draft.estimatedValue) : null,
        metadata: draft.notes ? JSON.stringify({ notes: draft.notes }) : null,
        createdAt: now,
      })

      return id
    },
    onSuccess: () => {
      refreshAggregationEngine()
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
    },
  })
}
