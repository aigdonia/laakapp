import { useState, useEffect, useCallback } from "react"

/**
 * Hydration-safe localStorage hook.
 * Returns `initialValue` on first render (SSR-safe), then syncs with localStorage.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)

  // Read from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setState(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [key])

  // Write to localStorage on change (skip initial hydration)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [key, state, hydrated])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value
        return next
      })
    },
    []
  )

  return [state, setValue]
}
