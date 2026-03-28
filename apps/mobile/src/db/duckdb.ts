/**
 * Aggregation query engine.
 *
 * Currently backed by expo-sqlite (same DB as userDb).
 * Structured so DuckDB can be swapped in later — just change the `query` function.
 * The aggregation SQL is standard and works in both SQLite and DuckDB.
 */
import { expoDb } from './user-db'

export type AggRow = Record<string, unknown>

/** Run a read-only aggregation query and return rows */
export function query<T extends AggRow = AggRow>(sql: string): T[] {
  return expoDb.getAllSync<T>(sql)
}

/**
 * No-op for SQLite (same connection, always fresh).
 * When DuckDB is used, this would re-attach the sqlite_scanner.
 */
export function refreshAggregationEngine() {
  // SQLite reads are always fresh — no action needed
}
