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
import { usePreferences } from '@/src/store/preferences'
import { useDisplayLanguages } from '@/src/hooks/use-languages'
import { changeLanguage } from '@/src/i18n'
import { track } from '@/src/lib/analytics'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

export const LanguagePickerSheet = forwardRef<BottomSheetModal>(function LanguagePickerSheet(_, ref) {
  const colors = useThemeColors()
  const language = usePreferences((s) => s.language)
  const countryCode = usePreferences((s) => s.countryCode)
  const { t } = useTranslation('settings')
  const { data: languages = [] } = useDisplayLanguages()

  const handleSelect = useCallback(
    (code: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      track('setting_changed', { setting: 'language', value: code })
      changeLanguage(code, countryCode)
    },
    [countryCode],
  )

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
      handleIndicatorStyle={{ backgroundColor: colors.muted }}
    >
      <BottomSheetView className="px-5 pb-10 pt-2">
        <Text className="text-lg font-semibold text-text mb-4">{t('language')}</Text>

        <View className="gap-2">
          {languages.map((lang) => {
            const selected = language === lang.code
            return (
              <Pressable
                key={lang.code}
                className="flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70"
                onPress={() => handleSelect(lang.code)}
              >
                <View className="flex-1">
                  <Text className="text-base font-medium text-text">{lang.nativeName}</Text>
                  <Text className="text-xs text-muted mt-0.5">{lang.name}</Text>
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
