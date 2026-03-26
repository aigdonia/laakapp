import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

const mmkv = createMMKV({ id: 'notification-prefs' })

const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => { mmkv.remove(name) },
}

interface NotificationState {
  expoToken: string | null
  marketing: boolean
  content: boolean
  onboarding: boolean
  permissionGranted: boolean
}

interface NotificationActions {
  setExpoToken: (token: string | null) => void
  setPermissionGranted: (granted: boolean) => void
  setMarketing: (value: boolean) => void
  setContent: (value: boolean) => void
  setOnboarding: (value: boolean) => void
  getPrefs: () => { marketing: boolean; content: boolean; onboarding: boolean }
}

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  persist(
    (set, get) => ({
      expoToken: null,
      marketing: true,
      content: true,
      onboarding: true,
      permissionGranted: false,

      setExpoToken: (token) => set({ expoToken: token }),
      setPermissionGranted: (granted) => set({ permissionGranted: granted }),
      setMarketing: (value) => set({ marketing: value }),
      setContent: (value) => set({ content: value }),
      setOnboarding: (value) => set({ onboarding: value }),
      getPrefs: () => {
        const { marketing, content, onboarding } = get()
        return { marketing, content, onboarding }
      },
    }),
    {
      name: 'notification-prefs',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: ({ expoToken, marketing, content, onboarding, permissionGranted }) => ({
        expoToken,
        marketing,
        content,
        onboarding,
        permissionGranted,
      }),
    }
  )
)
