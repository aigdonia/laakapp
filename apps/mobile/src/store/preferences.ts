import { Appearance } from 'react-native'
import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'
import * as SecureStore from 'expo-secure-store'

// --- Types ---

export type ThemePreference = 'light' | 'dark' | 'system'

/** Maps default market exchange to country code */
export const MARKET_COUNTRY: Record<string, string> = {
  EGX: 'EG',
  TADAWUL: 'SA',
  BURSA: 'MY',
}

interface PreferencesState {
  theme: ThemePreference
  amountsVisible: boolean
  defaultMarket: string
  baseCurrency: string
  shariaAuthority: string
  language: string
  countryCode: string
}

interface PreferencesActions {
  setTheme: (value: ThemePreference) => void
  toggleAmountsVisible: () => void
  setDefaultMarket: (value: string) => void
  setBaseCurrency: (value: string) => void
  setShariaAuthority: (value: string) => void
  setLanguage: (value: string) => void
  setCountryCode: (value: string) => void
}

// --- MMKV instance ---

const mmkv = createMMKV({ id: 'user-preferences' })

const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => { mmkv.remove(name) },
}

// --- Store ---

export const usePreferences = create<PreferencesState & PreferencesActions>()(
  persist(
    (set) => ({
      // State
      theme: 'system',
      amountsVisible: true,
      defaultMarket: 'EGX',
      baseCurrency: 'EGP',
      shariaAuthority: 'AAOIFI',
      language: 'en',
      countryCode: 'EG',

      // Actions
      setTheme: (value) => {
        Appearance.setColorScheme(value === 'system' ? null : value)
        set({ theme: value })
      },
      toggleAmountsVisible: () =>
        set((s) => ({ amountsVisible: !s.amountsVisible })),
      setDefaultMarket: (value) => set({ defaultMarket: value }),
      setBaseCurrency: (value) => set({ baseCurrency: value }),
      setShariaAuthority: (value) => set({ shariaAuthority: value }),
      setLanguage: (value) => set({ language: value }),
      setCountryCode: (value) => set({ countryCode: value }),
    }),
    {
      name: 'preferences',
      storage: createJSONStorage(() => mmkvStorage),
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as PreferencesState & PreferencesActions
        if (version < 2) {
          state.countryCode = MARKET_COUNTRY[state.defaultMarket] ?? 'EG'
        }
        return state
      },
      partialize: ({ theme, amountsVisible, defaultMarket, baseCurrency, shariaAuthority, language, countryCode }) => ({
        theme,
        amountsVisible,
        defaultMarket,
        baseCurrency,
        shariaAuthority,
        language,
        countryCode,
      }),
    },
  ),
)

// --- Module-level helpers (sync, safe to call before first render) ---

/** Restore persisted theme on app launch — call at module level. */
export function applyThemePreference() {
  const { theme } = usePreferences.getState()
  Appearance.setColorScheme(theme === 'system' ? null : theme)
}

const MIGRATION_FLAG = 'securestore-migrated'

/** One-time migration from expo-secure-store → MMKV. Sync & idempotent. */
export function migrateFromSecureStore() {
  if (mmkv.getBoolean(MIGRATION_FLAG)) return

  const legacy = SecureStore.getItem('theme_preference') as ThemePreference | null
  if (legacy) {
    usePreferences.setState({ theme: legacy })
  }

  mmkv.set(MIGRATION_FLAG, true)
}
