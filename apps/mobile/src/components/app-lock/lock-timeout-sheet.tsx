import { forwardRef, useCallback } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { IconClock } from '@tabler/icons-react-native'
import * as Haptics from 'expo-haptics'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import { type LockTimeout, usePreferences } from '@/src/store/preferences'
import { track } from '@/src/lib/analytics'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

export const LockTimeoutSheet = forwardRef<BottomSheetModal>(function LockTimeoutSheet(_, ref) {
  const colors = useThemeColors()
  const { t } = useTranslation('settings')
  const timeout = usePreferences((s) => s.lockTimeout)
  const setTimeout_ = usePreferences((s) => s.setLockTimeout)

  const handleSelect = useCallback(
    (value: LockTimeout) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      track('setting_changed', { setting: 'lock_timeout', value })
      setTimeout_(value)
    },
    [setTimeout_],
  )

  const options: { value: LockTimeout; label: string }[] = [
    { value: 0, label: t('lock_immediately') },
    { value: 30, label: t('lock_after_30s') },
    { value: 60, label: t('lock_after_1m') },
    { value: 300, label: t('lock_after_5m') },
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
        <Text className="text-lg font-semibold text-text mb-4">{t('lock_auto_lock')}</Text>

        <View className="gap-2">
          {options.map((opt) => {
            const selected = timeout === opt.value
            return (
              <Pressable
                key={opt.value}
                className="flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70"
                onPress={() => handleSelect(opt.value)}
              >
                <IconClock size={22} color={colors.muted} />
                <Text className="flex-1 ml-3 text-base font-medium text-text">
                  {opt.label}
                </Text>
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
