import { forwardRef, useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import { savePinHash } from '@/src/lib/pin'
import { usePreferences } from '@/src/store/preferences'
import { PinPad } from './pin-pad'
import { track } from '@/src/lib/analytics'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

export const PinSetupSheet = forwardRef<BottomSheetModal>(function PinSetupSheet(_, ref) {
  const colors = useThemeColors()
  const { t } = useTranslation('settings')
  const setAppLockEnabled = usePreferences((s) => s.setAppLockEnabled)

  const [step, setStep] = useState<'create' | 'confirm'>('create')
  const [firstPin, setFirstPin] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const reset = useCallback(() => {
    setStep('create')
    setFirstPin('')
    setPin('')
    setError(false)
  }, [])

  const handleComplete = useCallback(
    async (entered: string) => {
      if (step === 'create') {
        setFirstPin(entered)
        setPin('')
        setStep('confirm')
        return
      }

      // Confirm step
      if (entered === firstPin) {
        await savePinHash(entered)
        setAppLockEnabled(true)
        track('app_lock_enabled')
        reset()
        ;(ref as React.RefObject<BottomSheetModal>).current?.dismiss()
      } else {
        setError(true)
        setTimeout(() => {
          setPin('')
          setError(false)
          setStep('create')
          setFirstPin('')
        }, 400)
      }
    },
    [step, firstPin, ref, setAppLockEnabled, reset],
  )

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['70%']}
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
      handleIndicatorStyle={{ backgroundColor: colors.muted }}
      onDismiss={reset}
      enablePanDownToClose
    >
      <BottomSheetView className="flex-1 items-center px-5 pt-4">
        <Text className="text-lg font-semibold text-text mb-2">
          {step === 'create' ? t('lock_create_pin') : t('lock_confirm_pin')}
        </Text>
        {error && (
          <Text className="text-sm text-red-500 mb-2">{t('lock_pins_mismatch')}</Text>
        )}
        <View className="mt-6">
          <PinPad
            pin={pin}
            onPinChange={setPin}
            onComplete={handleComplete}
            error={error}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
})
