import { forwardRef, useCallback } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import * as Haptics from 'expo-haptics'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import { usePreferences } from '@/src/store/preferences'
import { usePortfolioPresets } from '@/src/hooks/use-portfolio-presets'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

export const PresetPickerSheet = forwardRef<BottomSheetModal>(function PresetPickerSheet(_, ref) {
  const colors = useThemeColors()
  const presetSlug = usePreferences((s) => s.portfolioPresetSlug)
  const { data: presets = [] } = usePortfolioPresets()
  const { t } = useTranslation('settings')

  const handleSelect = useCallback(
    (slug: string | null) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      usePreferences.getState().setPortfolioPresetSlug(slug)
    },
    [],
  )

  const formatAllocations = (allocations: Record<string, number>) => {
    return Object.entries(allocations)
      .sort(([, a], [, b]) => b - a)
      .map(([slug, pct]) => `${slug} ${pct}%`)
      .join(' · ')
  }

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
      handleIndicatorStyle={{ backgroundColor: colors.muted }}
    >
      <BottomSheetScrollView className="px-5 pb-10 pt-2">
        <Text className="text-lg font-semibold text-text mb-4">{t('portfolio_preset')}</Text>

        <View className="gap-2">
          {/* Equal Weight option */}
          <Pressable
            className="flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70"
            onPress={() => handleSelect(null)}
          >
            <View className="flex-1">
              <Text className="text-base font-medium text-text">{t('equal_weight')}</Text>
              <Text className="text-xs text-muted mt-0.5">{t('equal_weight_description')}</Text>
            </View>
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                presetSlug === null ? 'border-accent' : 'border-subtle'
              }`}
            >
              {presetSlug === null && <View className="w-2.5 h-2.5 rounded-full bg-accent" />}
            </View>
          </Pressable>

          {presets.map((preset) => {
            const selected = presetSlug === preset.slug
            return (
              <Pressable
                key={preset.slug}
                className="flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70"
                onPress={() => handleSelect(preset.slug)}
              >
                <View className="flex-1">
                  <Text className="text-base font-medium text-text">{preset.name}</Text>
                  <Text className="text-xs text-muted mt-0.5">
                    {formatAllocations(preset.allocations as Record<string, number>)}
                  </Text>
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
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})
