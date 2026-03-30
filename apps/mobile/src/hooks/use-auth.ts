import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'

interface AuthState {
  isAnonymous: boolean
  email: string | null
  userId: string | null
  isLoading: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    isAnonymous: true,
    email: null,
    userId: null,
    isLoading: true,
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        isAnonymous: session?.user?.is_anonymous ?? true,
        email: session?.user?.email ?? null,
        userId: session?.user?.id ?? null,
        isLoading: false,
      })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        isAnonymous: session?.user?.is_anonymous ?? true,
        email: session?.user?.email ?? null,
        userId: session?.user?.id ?? null,
        isLoading: false,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}
