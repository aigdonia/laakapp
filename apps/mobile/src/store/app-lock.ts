import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'

// Brute-force tracking persisted in separate MMKV so counts survive app restart
const securityMmkv = createMMKV({ id: 'app-lock-security' })

function getBackoffMs(attempts: number): number {
  if (attempts <= 3) return 0
  if (attempts <= 5) return 30_000
  if (attempts <= 7) return 120_000
  if (attempts <= 9) return 300_000
  return 900_000
}

interface AppLockStore {
  isLocked: boolean
  failedAttempts: number
  lockoutUntil: number | null
  lock: () => void
  unlock: () => void
  recordFailedAttempt: () => void
  resetAttempts: () => void
}

export const useAppLock = create<AppLockStore>((set, get) => ({
  isLocked: false,
  failedAttempts: securityMmkv.getNumber('failedAttempts') ?? 0,
  lockoutUntil: securityMmkv.getNumber('lockoutUntil') ?? null,

  lock: () => set({ isLocked: true }),

  unlock: () => set({ isLocked: false }),

  recordFailedAttempt: () => {
    const attempts = get().failedAttempts + 1
    const backoff = getBackoffMs(attempts)
    const lockoutUntil = backoff > 0 ? Date.now() + backoff : null

    securityMmkv.set('failedAttempts', attempts)
    if (lockoutUntil) securityMmkv.set('lockoutUntil', lockoutUntil)

    set({ failedAttempts: attempts, lockoutUntil })
  },

  resetAttempts: () => {
    securityMmkv.remove('failedAttempts')
    securityMmkv.remove('lockoutUntil')
    set({ failedAttempts: 0, lockoutUntil: null })
  },
}))
