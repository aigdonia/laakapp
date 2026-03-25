import { forwardRef, useCallback, useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { IconFingerprint, IconKeyboard } from '@tabler/icons-react-native'
import * as Haptics from 'expo-haptics'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import { type LockMethod, usePreferences } from '@/src/store/preferences'
import { getBiometricLabel, getBiometricStatus } from '@/src/lib/biometrics'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

export const LockMethodSheet = forwardRef<BottomSheetModal>(function LockMethodSheet(_, ref) {
  const colors = useThemeColors()
  const { t } = useTranslation('settings')
  const method = usePreferences((s) => s.lockMethod)
  const setMethod = usePreferences((s) => s.setLockMethod)
  const [biometricLabel, setBiometricLabel] = useState('Biometrics')
  const [biometricAvailable, setBiometricAvailable] = useState(true)

  useEffect(() => {
    getBiometricStatus().then((status) => {
      setBiometricAvailable(status.available && status.enrolled)
      if (status.types.length > 0) {
        setBiometricLabel(getBiometricLabel(status.types))
      }
    })
  }, [])

  const handleSelect = useCallback(
    (value: LockMethod) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      setMethod(value)
    },
    [setMethod],
  )

  const options: { value: LockMethod; label: string; subtitle?: string; icon: (c: string) => React.ReactNode; disabled?: boolean }[] = [
    {
      value: 'biometric',
      label: biometricLabel,
      subtitle: !biometricAvailable ? t('lock_not_available') : undefined,
      icon: (c) => <IconFingerprint size={22} color={c} />,
      disabled: !biometricAvailable,
    },
    {
      value: 'pin',
      label: t('lock_pin_only'),
      icon: (c) => <IconKeyboard size={22} color={c} />,
    },
  ]

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
      handleIndicatorStyle={{ backgroundColor: colors.muted }}
    >
      <BottomSheetView className="px-5 pb-10 pt-2">
        <Text className="text-lg font-semibold text-text mb-4">{t('lock_method')}</Text>

        <View className="gap-2">
          {options.map((opt) => {
            const selected = method === opt.value
            return (
              <Pressable
                key={opt.value}
                className={`flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70 ${opt.disabled ? 'opacity-50' : ''}`}
                onPress={() => !opt.disabled && handleSelect(opt.value)}
                disabled={opt.disabled}
              >
                {opt.icon(colors.muted)}
                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-text">{opt.label}</Text>
                  {opt.subtitle && (
                    <Text className="text-xs text-muted mt-0.5">{opt.subtitle}</Text>
                  )}
                </View>
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    selected ? 'border-accent' : 'border-subtle'
                  }`}
                >
                  {selected && <View className="w-2.5 h-2.5 rounded-full bg-accent" />}
                </View>
              </Pressable>
            )
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
})
