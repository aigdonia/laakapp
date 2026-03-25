import { openDatabaseSync } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import migrations from '@/drizzle/user/migrations'

const expoDb = openDatabaseSync('user-data.db')
export const userDb = drizzle(expoDb)

export function useUserDbMigrations() {
  return useMigrations(userDb, migrations)
}

export function resetUserDb() {
  expoDb.execSync(`DELETE FROM transactions`)
  expoDb.execSync(`DELETE FROM sync_meta`)
}
