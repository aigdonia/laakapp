import { Pressable, Text, View } from 'react-native'
import { IconChartDots } from '@tabler/icons-react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'

export function InsightsEmptyState() {
  const colors = useThemeColors()
  const { t } = useTranslation('insights')

  return (
    <View className="flex-1 items-center justify-center bg-screen px-6">
      <View className="bg-card rounded-full p-5 mb-5">
        <IconChartDots size={48} color={colors.subtle} />
      </View>

      <Text className="text-2xl font-bold text-text text-center">
        {t('empty_title')}
      </Text>
      <Text className="text-base text-muted text-center mt-2">
        {t('empty_subtitle')}
      </Text>

      <Pressable
        className="bg-accent rounded-2xl px-14 py-4 mt-8 active:opacity-70"
        onPress={() => router.push('/add-holding')}
      >
        <Text className="text-[#1c1c1e] text-base font-bold">{t('portfolio:add_holding')}</Text>
      </Pressable>
    </View>
  )
}
