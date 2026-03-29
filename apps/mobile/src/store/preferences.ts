import { Appearance } from 'react-native'
import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'
import * as SecureStore from 'expo-secure-store'

// --- Types ---

export type ThemePreference = 'light' | 'dark' | 'system'
export type LockMethod = 'biometric' | 'pin'
export type LockTimeout = 0 | 30 | 60 | 300

interface PreferencesState {
  theme: ThemePreference
  amountsVisible: boolean
  swipeNavigation: boolean
  baseCurrency: string
  shariaAuthority: string
  language: string
  countryCode: string
  appLockEnabled: boolean
  lockMethod: LockMethod
  lockTimeout: LockTimeout
  portfolioPresetSlug: string | null
  stocksSyncedAt: string | null
}

interface PreferencesActions {
  setTheme: (value: ThemePreference) => void
  toggleAmountsVisible: () => void
  toggleSwipeNavigation: () => void

  setBaseCurrency: (value: string) => void
  setShariaAuthority: (value: string) => void
  setLanguage: (value: string) => void
  setCountryCode: (value: string) => void
  setAppLockEnabled: (value: boolean) => void
  setLockMethod: (value: LockMethod) => void
  setLockTimeout: (value: LockTimeout) => void
  setPortfolioPresetSlug: (value: string | null) => void
  setStocksSyncedAt: (value: string | null) => void
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
      swipeNavigation: true,

      baseCurrency: 'EGP',
      shariaAuthority: 'aaoifi-standard',
      language: 'en',
      countryCode: 'EG',
      appLockEnabled: false,
      lockMethod: 'biometric',
      lockTimeout: 0,
      portfolioPresetSlug: null,
      stocksSyncedAt: null,

      // Actions
      setTheme: (value) => {
        Appearance.setColorScheme(value === 'system' ? null : value)
        set({ theme: value })
      },
      toggleAmountsVisible: () =>
        set((s) => ({ amountsVisible: !s.amountsVisible })),
      toggleSwipeNavigation: () =>
        set((s) => ({ swipeNavigation: !s.swipeNavigation })),

      setBaseCurrency: (value) => set({ baseCurrency: value }),
      setShariaAuthority: (value) => set({ shariaAuthority: value }),
      setLanguage: (value) => set({ language: value }),
      setCountryCode: (value) => set({ countryCode: value, stocksSyncedAt: null }),
      setAppLockEnabled: (value) => set({ appLockEnabled: value }),
      setLockMethod: (value) => set({ lockMethod: value }),
      setLockTimeout: (value) => set({ lockTimeout: value }),
      setPortfolioPresetSlug: (value) => set({ portfolioPresetSlug: value }),
      setStocksSyncedAt: (value) => set({ stocksSyncedAt: value }),
    }),
    {
      name: 'preferences',
      storage: createJSONStorage(() => mmkvStorage),
      version: 6,
      migrate: (persisted: unknown, version: number) => {
        const raw = persisted as Record<string, unknown>
        const state = raw as unknown as PreferencesState & PreferencesActions
        if (version < 2) {
          // Legacy: defaultMarket → countryCode (removed in v4)
          const marketCountry: Record<string, string> = { EGX: 'EG', TADAWUL: 'SA', BURSA: 'MY' }
          const legacy = raw.defaultMarket as string | undefined
          state.countryCode = marketCountry[legacy ?? 'EGX'] ?? 'EG'
        }
        if (version < 3) {
          state.portfolioPresetSlug = null
        }
        if (version < 4) {
          delete raw.defaultMarket
        }
        if (version < 5) {
          state.stocksSyncedAt = null
        }
        if (version < 6) {
          // Migrate methodology name → slug for shariaAuthority
          const slugMap: Record<string, string> = { AAOIFI: 'aaoifi-standard', DJIM: 'dow-jones-islamic-market' }
          const old = raw.shariaAuthority as string | undefined
          state.shariaAuthority = slugMap[old ?? 'AAOIFI'] ?? 'aaoifi-standard'
        }
        return state
      },
      partialize: ({ theme, amountsVisible, swipeNavigation, baseCurrency, shariaAuthority, language, countryCode, appLockEnabled, lockMethod, lockTimeout, portfolioPresetSlug, stocksSyncedAt }) => ({
        theme,
        amountsVisible,
        swipeNavigation,
        baseCurrency,
        shariaAuthority,
        language,
        countryCode,
        appLockEnabled,
        lockMethod,
        lockTimeout,
        portfolioPresetSlug,
        stocksSyncedAt,
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
