import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>()
  const { t } = useTranslation('screening')

  return (
    <View className="flex-1 items-center justify-center bg-screen">
      <Text className="text-2xl font-bold text-text">{symbol}</Text>
      <Text className="mt-2 text-muted">{t('stock_detail')}</Text>
    </View>
  )
}
