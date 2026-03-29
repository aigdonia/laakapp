import { createContext, useContext, type ReactNode } from 'react'
import { useSharedValue, type SharedValue } from 'react-native-reanimated'

interface TabSwipeContextValue {
  /** Gesture progress: 0 = idle, -1 = full swipe left, +1 = full swipe right */
  progress: SharedValue<number>
  /** Index of the currently active tab in TAB_ORDER */
  activeIndex: SharedValue<number>
  /** Index of the target tab (-1 when idle) */
  targetIndex: SharedValue<number>
  /** Whether a bounce animation should play on the destination icon */
  bounceTarget: SharedValue<number>
}

const TabSwipeContext = createContext<TabSwipeContextValue | null>(null)

export function TabSwipeProvider({ children }: { children: ReactNode }) {
  const progress = useSharedValue(0)
  const activeIndex = useSharedValue(0)
  const targetIndex = useSharedValue(-1)
  const bounceTarget = useSharedValue(-1)

  return (
    <TabSwipeContext.Provider value={{ progress, activeIndex, targetIndex, bounceTarget }}>
      {children}
    </TabSwipeContext.Provider>
  )
}

export function useTabSwipe() {
  const ctx = useContext(TabSwipeContext)
  if (!ctx) throw new Error('useTabSwipe must be used within TabSwipeProvider')
  return ctx
}
