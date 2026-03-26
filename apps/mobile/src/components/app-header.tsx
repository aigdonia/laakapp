import { Pressable, Text, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { IconCoins } from '@tabler/icons-react-native'

import { useThemeColors } from '@/src/theme/colors'
import { LaakLogo } from '@/src/components/laak-logo'
import { useCredits } from '@/src/store/credits'

export function AppHeader() {
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()
  const router = useRouter()
  const { width } = useWindowDimensions()
  const balance = useCredits((s) => s.balance)

  return (
    <View
      className="flex-row items-center justify-between px-5 pb-0 bg-screen"
      style={{ paddingTop: insets.top-10 }}
    >
      <LaakLogo color={colors.text} size={Math.round(width * 0.15)} />

      <Pressable
        className="flex-row items-center bg-card px-3 py-1.5 rounded-full gap-1 active:opacity-70"
        onPress={() => router.push('/credits')}
      >
        <IconCoins size={16} color={colors.accent} />
        <Text className="text-sm font-semibold text-accent">
          {balance}
        </Text>
      </Pressable>
    </View>
  )
}
