import { useState } from 'react'
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import {
  IconChartLine,
  IconChartPie,
  IconCurrencyBitcoin,
  IconCash,
  IconCertificate,
  IconBuilding,
  IconDots,
  IconSearch,
} from '@tabler/icons-react-native'
import type { Stock } from '@fin-ai/shared'
import { useTranslation } from 'react-i18next'

import type { AssetType } from '@/src/types/holdings'
import { useStockSearch } from '@/src/hooks/use-stocks'
import { useAssetClasses } from '@/src/hooks/use-asset-classes'
import { useThemeColors } from '@/src/theme/colors'
import { StockSearchResults } from './stock-search-results'
import { CreditIcon } from '@/src/components/credit-icon'

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  'chart-line': IconChartLine,
  'chart-pie': IconChartPie,
  'currency-bitcoin': IconCurrencyBitcoin,
  'coins': CreditIcon,
  'cash': IconCash,
  'certificate': IconCertificate,
  'building': IconBuilding,
  'dots': IconDots,
}

type Props = {
  onSelect: (type: AssetType, stock?: Stock) => void
}

export function TypeSelector({ onSelect }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const { results } = useStockSearch(searchQuery)
  const { data: assetClasses, isLoading } = useAssetClasses()
  const colors = useThemeColors()
  const { t } = useTranslation('add_holding')

  return (
    <View className="flex-1 px-5 pt-4 bg-screen">
      <Text className="text-3xl font-extrabold mb-1 text-text">{t('title')}</Text>
      <Text className="text-base mb-5 text-subtle">
        {t('subtitle')}
      </Text>

      <View className="flex-row items-center rounded-xl px-3.5 py-2.5 mb-3 gap-2.5 bg-card">
        <IconSearch size={18} color={colors.subtle} />
        <TextInput
          className="flex-1 text-base p-0 text-text"
          placeholderTextColorClassName="text-subtle"
          placeholder={t('search_stocks')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="characters"
        />
      </View>

      {searchQuery.trim().length > 0 && (
        <StockSearchResults
          results={results}
          onSelect={(stock) => {
            const type: AssetType = stock.sector?.toLowerCase().includes('etf') ? 'etf' : 'stock'
            onSelect(type, stock)
          }}
        />
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator size="large" color={colors.subtle} />
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-3">
          {assetClasses?.map((ac) => {
            const IconComponent = ICON_MAP[ac.icon] ?? IconDots
            return (
              <Pressable
                key={ac.id}
                className="w-[47%] rounded-2xl p-4 items-center gap-2.5 bg-card active:opacity-70"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                  onSelect(ac.slug as AssetType)
                }}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: ac.color + '20' }}
                >
                  <IconComponent size={24} color={ac.color} />
                </View>
                <Text className="text-sm font-semibold text-text">{ac.name}</Text>
              </Pressable>
            )
          })}
        </View>
      )}
    </View>
  )
}
