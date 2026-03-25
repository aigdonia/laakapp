import { Text, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IconCoins } from '@tabler/icons-react-native'

import { useThemeColors } from '@/src/theme/colors'
import { LaakLogo } from '@/src/components/laak-logo'

export function AppHeader() {
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()
  const { width } = useWindowDimensions()

  return (
    <View
      className="flex-row items-center justify-between px-5 pb-0 bg-screen"
      style={{ paddingTop: insets.top-10 }}
    >
      <LaakLogo color={colors.text} size={Math.round(width * 0.15)} />

      <View className="flex-row items-center bg-card px-3 py-1.5 rounded-full gap-1">
        <IconCoins size={16} color={colors.accent} />
        <Text className="text-sm font-semibold text-accent">
          10
        </Text>
      </View>
    </View>
  )
}
