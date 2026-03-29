import { forwardRef, useCallback } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react-native'
import * as Haptics from 'expo-haptics'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import { type ThemePreference, usePreferences } from '@/src/store/preferences'
import { track } from '@/src/lib/analytics'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

export const ThemePickerSheet = forwardRef<BottomSheetModal>(function ThemePickerSheet(_, ref) {
  const colors = useThemeColors()
  const preference = usePreferences((s) => s.theme)
  const setTheme = usePreferences((s) => s.setTheme)
  const { t } = useTranslation('settings')

  const options: { value: ThemePreference; labelKey: string; icon: (color: string) => ReactNode }[] = [
    { value: 'light', labelKey: 'light', icon: (c) => <IconSun size={22} color={c} /> },
    { value: 'dark', labelKey: 'dark', icon: (c) => <IconMoon size={22} color={c} /> },
    { value: 'system', labelKey: 'system', icon: (c) => <IconDeviceDesktop size={22} color={c} /> },
  ]

  const handleSelect = useCallback(
    (value: ThemePreference) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      track('setting_changed', { setting: 'theme', value })
      setTheme(value)
    },
    [setTheme],
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
        <Text className="text-lg font-semibold text-text mb-4">{t('theme')}</Text>

        <View className="gap-2">
          {options.map((opt) => {
            const selected = preference === opt.value
            return (
              <Pressable
                key={opt.value}
                className="flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70"
                onPress={() => handleSelect(opt.value)}
              >
                {opt.icon(colors.muted)}
                <Text className="flex-1 ml-3 text-base font-medium text-text">
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
})
