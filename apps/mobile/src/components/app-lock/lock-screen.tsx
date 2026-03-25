import { useCallback, useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { usePreferences } from '@/src/store/preferences'
import { useAppLock } from '@/src/store/app-lock'
import { verifyPin } from '@/src/lib/pin'
import { authenticateBiometric, getBiometricStatus } from '@/src/lib/biometrics'
import { LaakLogo } from '@/src/components/laak-logo'
import { useThemeColors } from '@/src/theme/colors'
import { PinPad } from './pin-pad'

export function LockScreen() {
  const { t } = useTranslation('settings')
  const colors = useThemeColors()
  const isLocked = useAppLock((s) => s.isLocked)
  const lockoutUntil = useAppLock((s) => s.lockoutUntil)
  const unlock = useAppLock((s) => s.unlock)
  const recordFailedAttempt = useAppLock((s) => s.recordFailedAttempt)
  const resetAttempts = useAppLock((s) => s.resetAttempts)
  const appLockEnabled = usePreferences((s) => s.appLockEnabled)
  const lockMethod = usePreferences((s) => s.lockMethod)

  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const biometricTriggered = useRef(false)

  const isLockedOut = lockoutUntil !== null && lockoutUntil > Date.now()

  // Countdown timer for lockout
  useEffect(() => {
    if (!isLockedOut) {
      setCountdown(0)
      return
    }
    const remaining = Math.ceil((lockoutUntil! - Date.now()) / 1000)
    setCountdown(remaining)
    const interval = setInterval(() => {
      const r = Math.ceil((lockoutUntil! - Date.now()) / 1000)
      if (r <= 0) {
        setCountdown(0)
        clearInterval(interval)
      } else {
        setCountdown(r)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isLockedOut, lockoutUntil])

  const handleBiometric = useCallback(async () => {
    const status = await getBiometricStatus()
    if (!status.available || !status.enrolled) return
    const result = await authenticateBiometric(t('lock_unlock'))
    if (result.success) {
      resetAttempts()
      unlock()
    }
  }, [unlock, resetAttempts, t])

  // Auto-trigger biometric on mount
  useEffect(() => {
    if (!isLocked || !appLockEnabled || lockMethod !== 'biometric') return
    if (biometricTriggered.current) return
    biometricTriggered.current = true
    // Small delay for screen to render
    const timer = setTimeout(() => handleBiometric(), 300)
    return () => clearTimeout(timer)
  }, [isLocked, appLockEnabled, lockMethod, handleBiometric])

  // Reset biometric trigger when lock state changes
  useEffect(() => {
    if (!isLocked) biometricTriggered.current = false
  }, [isLocked])

  const handleComplete = useCallback(
    async (entered: string) => {
      const valid = await verifyPin(entered)
      if (valid) {
        resetAttempts()
        unlock()
        setPin('')
        setError(false)
      } else {
        setError(true)
        recordFailedAttempt()
        setTimeout(() => {
          setPin('')
          setError(false)
        }, 400)
      }
    },
    [unlock, resetAttempts, recordFailedAttempt],
  )

  if (!isLocked || !appLockEnabled) return null

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`
  }

  return (
    <View className="absolute inset-0 z-50 bg-screen items-center justify-center">
      <View className="items-center mb-12">
        <LaakLogo color={colors.accent} size={56} />
        <Text className="text-xl font-semibold text-text mt-4">
          {t('lock_unlock')}
        </Text>
      </View>

      {isLockedOut && countdown > 0 ? (
        <View className="items-center">
          <Text className="text-base text-muted mb-2">{t('lock_too_many')}</Text>
          <Text className="text-3xl font-bold text-text">
            {formatCountdown(countdown)}
          </Text>
        </View>
      ) : (
        <PinPad
          pin={pin}
          onPinChange={setPin}
          onComplete={handleComplete}
          onBiometric={handleBiometric}
          showBiometric={lockMethod === 'biometric'}
          disabled={isLockedOut}
          error={error}
        />
      )}
    </View>
  )
}
