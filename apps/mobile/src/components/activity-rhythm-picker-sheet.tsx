import { forwardRef, useCallback } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import * as Haptics from 'expo-haptics'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import { type ActivityRhythm, usePreferences } from '@/src/store/preferences'
import { track } from '@/src/lib/analytics'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

const options: { value: ActivityRhythm; labelKey: string }[] = [
  { value: 'daily', labelKey: 'rhythm_daily' },
  { value: 'weekly', labelKey: 'rhythm_weekly' },
  { value: 'biweekly', labelKey: 'rhythm_biweekly' },
  { value: 'monthly', labelKey: 'rhythm_monthly' },
]

export const ActivityRhythmPickerSheet = forwardRef<BottomSheetModal>(
  function ActivityRhythmPickerSheet(_, ref) {
    const colors = useThemeColors()
    const current = usePreferences((s) => s.activityRhythm)
    const { t } = useTranslation('settings')

    const handleSelect = useCallback((value: ActivityRhythm) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      track('setting_changed', { setting: 'activity_rhythm', value })
      usePreferences.getState().setActivityRhythm(value)
    }, [])

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backdropComponent={Backdrop}
        backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
        handleIndicatorStyle={{ backgroundColor: colors.muted }}
      >
        <BottomSheetView className="px-5 pb-10 pt-2">
          <Text className="text-lg font-semibold text-text mb-4">{t('activity_rhythm')}</Text>

          <View className="gap-2">
            {options.map((opt) => {
              const selected = current === opt.value
              return (
                <Pressable
                  key={opt.value}
                  className="flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70"
                  onPress={() => handleSelect(opt.value)}
                >
                  <Text className="flex-1 text-base font-medium text-text">
                    {t(opt.labelKey)}
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
  },
)
