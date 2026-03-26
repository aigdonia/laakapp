import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

interface OnboardingState {
  completed: boolean
  answers: Record<string, string | string[]>
}

interface OnboardingActions {
  setAnswer: (slug: string, value: string | string[]) => void
  markCompleted: () => void
  reset: () => void
}

const mmkv = createMMKV({ id: 'onboarding' })

const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => { mmkv.remove(name) },
}

export const useOnboarding = create<OnboardingState & OnboardingActions>()(
  persist(
    (set) => ({
      completed: false,
      answers: {},

      setAnswer: (slug, value) =>
        set((s) => ({ answers: { ...s.answers, [slug]: value } })),
      markCompleted: () => set({ completed: true }),
      reset: () => set({ completed: false, answers: {} }),
    }),
    {
      name: 'onboarding',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: ({ completed, answers }) => ({ completed, answers }),
    },
  ),
)
