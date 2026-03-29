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
import { useExchangeRates } from '@/src/hooks/use-exchange-rates'
import { useLookups } from '@/src/hooks/use-lookups'
import { track } from '@/src/lib/analytics'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

export const CurrencyPickerSheet = forwardRef<BottomSheetModal>(function CurrencyPickerSheet(_, ref) {
  const colors = useThemeColors()
  const baseCurrency = usePreferences((s) => s.baseCurrency)
  const setBaseCurrency = usePreferences((s) => s.setBaseCurrency)
  const { t } = useTranslation('settings')
  const { data: rates = [] } = useExchangeRates()
  const { data: lookups = [] } = useLookups()

  const currencyLookups = new Map(
    lookups.filter((l) => l.category === 'currencies').map((l) => [l.value, l]),
  )

  const enabledRates = rates.filter((r) => r.enabled)

  const handleSelect = useCallback(
    (currency: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      track('setting_changed', { setting: 'currency', value: currency })
      setBaseCurrency(currency)
    },
    [setBaseCurrency],
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
        <Text className="text-lg font-semibold text-text mb-4">{t('base_currency')}</Text>

        <View className="gap-2">
          {enabledRates.map((rate) => {
            const lookup = currencyLookups.get(rate.currency)
            const meta = (lookup?.metadata ?? {}) as Record<string, string>
            const selected = baseCurrency === rate.currency
            return (
              <Pressable
                key={rate.currency}
                className="flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70"
                onPress={() => handleSelect(rate.currency)}
              >
                {meta?.flag && <Text className="text-2xl mr-3">{meta.flag}</Text>}
                <View className="flex-1">
                  <Text className="text-base font-medium text-text">{rate.currency}</Text>
                  {meta?.symbol && (
                    <Text className="text-xs text-muted">{meta.symbol}</Text>
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
