import * as Crypto from 'expo-crypto'
import * as SecureStore from 'expo-secure-store'

const PIN_KEY = 'app_lock_pin'

interface StoredPin {
  salt: string
  hash: string
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    salt + pin,
  )
}

export async function savePinHash(pin: string): Promise<void> {
  const saltBytes = Crypto.getRandomBytes(16)
  const salt = bytesToHex(saltBytes)
  const hash = await hashPin(pin, salt)
  const stored: StoredPin = { salt, hash }
  await SecureStore.setItemAsync(PIN_KEY, JSON.stringify(stored))
}

export async function verifyPin(pin: string): Promise<boolean> {
  const raw = await SecureStore.getItemAsync(PIN_KEY)
  if (!raw) return false
  const stored: StoredPin = JSON.parse(raw)
  const hash = await hashPin(pin, stored.salt)
  return hash === stored.hash
}

export function hasPinSet(): boolean {
  return SecureStore.getItem(PIN_KEY) !== null
}

export async function clearPin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY)
}
