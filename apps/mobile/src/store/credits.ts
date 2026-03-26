import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

import { getLakBalance, invalidateLakCache } from '@/src/lib/purchases'

// --- MMKV instance ---

const mmkv = createMMKV({ id: 'credits-store' })

const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => { mmkv.remove(name) },
}

// --- Types ---

interface CreditsState {
  balance: number
  isLoading: boolean
}

interface CreditsActions {
  setBalance: (n: number) => void
  refreshBalance: () => Promise<void>
}

// --- Store ---

export const useCredits = create<CreditsState & CreditsActions>()(
  persist(
    (set) => ({
      balance: 0,
      isLoading: false,

      setBalance: (n) => set({ balance: n }),

      refreshBalance: async () => {
        set({ isLoading: true })
        try {
          await invalidateLakCache()
          const balance = await getLakBalance()
          set({ balance, isLoading: false })
        } catch {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'credits',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: ({ balance }) => ({ balance }),
    },
  ),
)
