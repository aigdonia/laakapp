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
import { IconCheck } from '@tabler/icons-react-native'

import { useThemeColors } from '@/src/theme/colors'
import { usePreferences } from '@/src/store/preferences'
import { useScreeningRules } from '@/src/hooks/use-screening-rules'
import { track } from '@/src/lib/analytics'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

/** Turn snake_case threshold keys into readable labels */
function humanizeKey(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export const ScreeningRulePickerSheet = forwardRef<BottomSheetModal>(function ScreeningRulePickerSheet(_, ref) {
  const colors = useThemeColors()
  const shariaAuthority = usePreferences((s) => s.shariaAuthority)
  const { data: rules = [] } = useScreeningRules()
  const { t } = useTranslation('settings')

  const handleSelect = useCallback((slug: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    track('setting_changed', { setting: 'sharia_authority', value: slug })
    usePreferences.getState().setShariaAuthority(slug)
  }, [])

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['90%']}
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
      handleIndicatorStyle={{ backgroundColor: colors.muted }}
    >
      <BottomSheetScrollView className="px-5 pb-10 pt-2">
        <Text className="text-xl font-bold text-text mb-1">{t('sharia_authority')}</Text>
        <Text className="text-sm text-muted mb-6">
          {t('sharia_authority_description')}
        </Text>

        <View className="gap-3">
          {rules.map((rule) => {
            const selected = shariaAuthority === rule.slug
            const thresholdEntries = Object.entries(rule.thresholds)

            return (
              <Pressable
                key={rule.slug}
                className={`bg-card rounded-2xl px-5 py-4 border-2 active:opacity-70 ${
                  selected ? 'border-accent' : 'border-border'
                }`}
                onPress={() => handleSelect(rule.slug)}
              >
                {/* Header row */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg font-semibold text-text">{rule.name}</Text>
                    <View className="bg-subtle/30 rounded-md px-2 py-0.5">
                      <Text className="text-xs font-medium text-muted">{rule.methodology}</Text>
                    </View>
                  </View>
                  {selected && (
                    <View className="w-6 h-6 rounded-full bg-accent items-center justify-center">
                      <IconCheck size={14} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                </View>

                {/* Description */}
                {rule.description ? (
                  <Text className="text-sm text-muted mb-3 leading-5">
                    {rule.description}
                  </Text>
                ) : null}

                {/* Thresholds */}
                {thresholdEntries.length > 0 && (
                  <View className="bg-screen rounded-xl px-4 py-3 gap-2.5">
                    {thresholdEntries.map(([key, val]) => (
                      <View key={key} className="flex-row items-center justify-between">
                        <Text className="text-sm text-text flex-1 mr-3">
                          {humanizeKey(key)}
                        </Text>
                        <Text className="text-sm font-semibold text-accent">
                          {val}%
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})
