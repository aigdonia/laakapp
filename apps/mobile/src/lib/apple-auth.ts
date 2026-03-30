import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from './supabase'
import { track } from './analytics'

export async function signInWithApple() {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  })

  if (!credential.identityToken) {
    throw new Error('No identity token returned from Apple')
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  })

  if (error) throw error

  track('apple_signin_completed')
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
  await supabase.auth.signInAnonymously()
  track('apple_signout_completed')
}
