import { ActivityIndicator, Text, View } from 'react-native'
import { Pressable } from 'react-native'
import {
  IconSparkles,
  IconRefresh,
  IconLock,
} from '@tabler/icons-react-native'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import { useStockAnalysis, STOCK_DEEPDIVE_COST } from '@/src/hooks/use-stock-analysis'

type Props = {
  holdingKey: string
  symbol: string | null
  assetType: string
  userContext: {
    quantity: number
    totalCost: number
    avgCost: number
    gainLoss: number | null
    gainLossPct: number | null
    currency: string
  }
}

export function StockDeepDiveBlock({ holdingKey, symbol, assetType, userContext }: Props) {
  const colors = useThemeColors()
  const { t, i18n } = useTranslation('insights')

  const { analysis, isStale, isLoading, generate } = useStockAnalysis(
    holdingKey,
    symbol,
    assetType,
    userContext,
    i18n.language,
  )

  // --- Loading ---
  if (isLoading) {
    return (
      <View className="bg-card rounded-2xl p-4">
        <View className="flex-row items-center gap-2 mb-3">
          <IconSparkles size={18} color={colors.accent} />
          <Text className="text-sm font-semibold text-text">{t('stock_analysis')}</Text>
        </View>
        <View className="flex-row items-center justify-center gap-2 py-6">
          <ActivityIndicator size="small" color={colors.accent} />
          <Text className="text-sm text-muted">{t('generating_narrative')}</Text>
        </View>
      </View>
    )
  }

  // --- Locked ---
  if (!analysis) {
    return (
      <View className="bg-card rounded-2xl p-4">
        <View className="flex-row items-center gap-2 mb-2">
          <IconSparkles size={18} color={colors.accent} />
          <Text className="text-sm font-semibold text-text">{t('stock_analysis')}</Text>
        </View>

        <Text className="text-sm text-muted mb-4">
          {t('stock_analysis_description')}
        </Text>

        <Pressable
          className="flex-row items-center justify-center gap-2 bg-accent/15 rounded-xl py-3 active:opacity-70"
          onPress={generate}
        >
          <IconLock size={16} color={colors.accent} />
          <Text className="text-sm font-semibold" style={{ color: colors.accent }}>
            {t('unlock_stock_analysis')}
          </Text>
          <View className="bg-accent/20 rounded-md px-1.5 py-0.5">
            <Text className="text-xs font-medium" style={{ color: colors.accent }}>
              {t('credits', { count: STOCK_DEEPDIVE_COST })}
            </Text>
          </View>
        </Pressable>
      </View>
    )
  }

  // --- Content ---
  return (
    <View className="bg-card rounded-2xl p-4 overflow-hidden">
      <View
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: colors.accent }}
      />
      <View className="flex-row items-center gap-2 mb-3">
        <IconSparkles size={16} color={colors.accent} />
        <Text className="text-sm font-semibold text-text">{t('stock_analysis')}</Text>
        <View className="bg-accent/15 rounded px-1.5 py-0.5 ml-auto">
          <Text className="text-[10px] text-muted">{t('ai_generated')}</Text>
        </View>
      </View>

      {/* Personalized intro */}
      {analysis.personalizedIntro ? (
        <Text className="text-sm text-text leading-5 mb-3 italic">
          {analysis.personalizedIntro}
        </Text>
      ) : null}

      {/* Stock analysis */}
      <Text className="text-sm text-text leading-5">{analysis.stockAnalysis}</Text>

      {/* Stale refresh nudge */}
      {isStale && (
        <Pressable
          className="flex-row items-center gap-1.5 mt-3 pt-3 border-t border-border"
          onPress={generate}
        >
          <IconRefresh size={14} color={colors.accent} />
          <Text className="text-xs" style={{ color: colors.accent }}>
            {t('new_analysis_available')}
          </Text>
        </Pressable>
      )}
    </View>
  )
}
