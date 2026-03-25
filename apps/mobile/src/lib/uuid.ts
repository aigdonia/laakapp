import * as SecureStore from 'expo-secure-store'
import { randomUUID } from 'expo-crypto'

const UUID_KEY = 'anonymous_user_id'

export async function getOrCreateUUID(): Promise<string> {
  const existing = await SecureStore.getItemAsync(UUID_KEY)
  if (existing) return existing

  const uuid = randomUUID()
  await SecureStore.setItemAsync(UUID_KEY, uuid)
  return uuid
}
