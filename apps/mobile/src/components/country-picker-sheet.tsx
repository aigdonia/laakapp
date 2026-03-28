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
import { useCountries } from '@/src/hooks/use-countries'
import { changeLanguage } from '@/src/i18n'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

export const CountryPickerSheet = forwardRef<BottomSheetModal>(function CountryPickerSheet(_, ref) {
  const colors = useThemeColors()
  const language = usePreferences((s) => s.language)
  const countryCode = usePreferences((s) => s.countryCode)
  const baseCurrency = usePreferences((s) => s.baseCurrency)
  const setBaseCurrency = usePreferences((s) => s.setBaseCurrency)
  const { t } = useTranslation('settings')
  const { data: countries = [] } = useCountries()

  const currentCountry = countries.find((c) => c.code === countryCode)

  const handleSelect = useCallback(
    (code: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

      // Auto-update baseCurrency if user hasn't manually changed it
      // (i.e. current baseCurrency still matches current country's currency)
      const newCountry = countries.find((c) => c.code === code)
      if (
        newCountry?.currency &&
        (!currentCountry?.currency || baseCurrency === currentCountry.currency)
      ) {
        setBaseCurrency(newCountry.currency)
      }

      changeLanguage(language, code)
    },
    [language, countries, currentCountry, baseCurrency, setBaseCurrency],
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
        <Text className="text-lg font-semibold text-text mb-4">{t('country')}</Text>

        <View className="gap-2">
          {countries.map((country) => {
            const selected = countryCode === country.code
            return (
              <Pressable
                key={country.code}
                className="flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70"
                onPress={() => handleSelect(country.code)}
              >
                <Text className="text-2xl mr-3">{country.flagEmoji}</Text>
                <Text className="flex-1 text-base font-medium text-text">{country.name}</Text>
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
