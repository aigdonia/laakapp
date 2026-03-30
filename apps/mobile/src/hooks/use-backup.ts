import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userDb, expoDb, transactions } from '@/src/db'
import { refreshAggregationEngine } from '@/src/db/duckdb'
import { api } from '@/src/lib/api'
import { useAuth } from './use-auth'

const CURRENT_SCHEMA_VERSION = 1

// Forward-migration functions for destructive schema changes.
// Additive changes (new columns) survive automatically via SQLite DEFAULTs.
// Add an entry here only when a column is renamed or removed.
const backupMigrations: Record<number, (txns: Record<string, unknown>[]) => Record<string, unknown>[]> = {
  // Example for future use:
  // 2: (txns) => txns.map(t => ({ ...t, totalFees: t.fees, fees: undefined })),
}

function migrateTransactions(
  txns: Record<string, unknown>[],
  fromVersion: number,
): Record<string, unknown>[] {
  let migrated = txns
  for (let v = fromVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    const migrateFn = backupMigrations[v]
    if (migrateFn) migrated = migrateFn(migrated)
  }
  return migrated
}

// ─── Types ──────────────────────────────────────────────────

interface BackupMeta {
  exists: boolean
  snapshot: {
    transactionCount: number
    sizeBytes: number
    schemaVersion: number
    createdAt: string
  } | null
}

interface BackupResult {
  ok: boolean
  transactionCount: number
  sizeBytes: number
}

interface RestoreResult {
  schemaVersion: number
  exportedAt: string
  transactionCount: number
  transactions: Record<string, unknown>[]
}

// ─── Hooks ──────────────────────────────────────────────────

export function useBackupMeta() {
  const { isAnonymous } = useAuth()

  return useQuery({
    queryKey: ['backup-meta'],
    queryFn: () => api.get<BackupMeta>('/backups'),
    enabled: !isAnonymous,
  })
}

export function useBackup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const rows = await userDb
        .select()
        .from(transactions)

      // Serialize dates as ISO strings for portability
      const serialized = rows.map((row) => ({
        ...row,
        date: row.date instanceof Date ? row.date.toISOString() : row.date,
        createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
      }))

      return api.post<BackupResult>('/backups', {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        transactions: serialized,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backup-meta'] })
    },
  })
}

export function useRestore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const data = await api.post<RestoreResult>('/backups/restore', {})

      // Reject if backup is from a newer app version
      if (data.schemaVersion > CURRENT_SCHEMA_VERSION) {
        throw new Error('schema_version_newer')
      }

      // Forward-migrate if backup is from an older version
      const migrated = data.schemaVersion < CURRENT_SCHEMA_VERSION
        ? migrateTransactions(data.transactions, data.schemaVersion)
        : data.transactions

      // Replace local data in a single transaction
      expoDb.withTransactionSync(() => {
        expoDb.runSync('DELETE FROM transactions')

        for (const row of migrated) {
          const r = row as Record<string, unknown>
          expoDb.runSync(
            `INSERT INTO transactions (
              id, type, quantity, price_per_unit, fees, notes, date,
              asset_type, symbol, name, exchange, currency,
              unit, purity, profit_rate, maturity_date, estimated_value,
              metadata, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              r.id as string,
              r.type as string,
              r.quantity as number,
              r.pricePerUnit as number,
              (r.fees as number) ?? 0,
              (r.notes as string) ?? null,
              r.date ? new Date(r.date as string).getTime() / 1000 : null,
              r.assetType as string,
              (r.symbol as string) ?? null,
              r.name as string,
              (r.exchange as string) ?? null,
              (r.currency as string) ?? 'USD',
              (r.unit as string) ?? null,
              (r.purity as string) ?? null,
              (r.profitRate as number) ?? null,
              (r.maturityDate as string) ?? null,
              (r.estimatedValue as number) ?? null,
              (r.metadata as string) ?? null,
              r.createdAt ? new Date(r.createdAt as string).getTime() / 1000 : Date.now() / 1000,
            ],
          )
        }
      })

      return data
    },
    onSuccess: () => {
      refreshAggregationEngine()
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
      queryClient.invalidateQueries({ queryKey: ['backup-meta'] })
    },
  })
}
