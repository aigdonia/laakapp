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
import { verifyPin, savePinHash } from '@/src/lib/pin'
import { PinPad } from './pin-pad'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

type Step = 'verify' | 'create' | 'confirm'

export const ChangePinSheet = forwardRef<BottomSheetModal>(function ChangePinSheet(_, ref) {
  const colors = useThemeColors()
  const { t } = useTranslation('settings')

  const [step, setStep] = useState<Step>('verify')
  const [newPin, setNewPin] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const reset = useCallback(() => {
    setStep('verify')
    setNewPin('')
    setPin('')
    setError(false)
  }, [])

  const handleComplete = useCallback(
    async (entered: string) => {
      if (step === 'verify') {
        const valid = await verifyPin(entered)
        if (valid) {
          setPin('')
          setStep('create')
        } else {
          setError(true)
          setTimeout(() => {
            setPin('')
            setError(false)
          }, 400)
        }
        return
      }

      if (step === 'create') {
        setNewPin(entered)
        setPin('')
        setStep('confirm')
        return
      }

      // Confirm step
      if (entered === newPin) {
        await savePinHash(entered)
        reset()
        ;(ref as React.RefObject<BottomSheetModal>).current?.dismiss()
      } else {
        setError(true)
        setTimeout(() => {
          setPin('')
          setError(false)
          setStep('create')
          setNewPin('')
        }, 400)
      }
    },
    [step, newPin, ref, reset],
  )

  const stepTitle: Record<Step, string> = {
    verify: t('lock_enter_current'),
    create: t('lock_enter_new'),
    confirm: t('lock_confirm_new'),
  }

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
          {stepTitle[step]}
        </Text>
        {error && (
          <Text className="text-sm text-red-500 mb-2">
            {step === 'verify' ? t('lock_wrong_pin') : t('lock_pins_mismatch')}
          </Text>
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
