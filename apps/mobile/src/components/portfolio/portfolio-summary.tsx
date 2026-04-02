import { useCallback, useState } from 'react'
import { Dimensions, Pressable, ScrollView, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'
import { IconEye, IconEyeOff } from '@tabler/icons-react-native'
import { useTranslation } from 'react-i18next'

import type { HoldingGroup } from '@/src/hooks/use-holdings'
import { useThemeColors } from '@/src/theme/colors'
import { usePreferences } from '@/src/store/preferences'
import { DirectionalView } from '@/src/components/directional-view'
import { AllocationChart } from './allocation-chart'
import { PortfolioOverviewCard } from './portfolio-overview-card'
import { Redacted } from './redacted'

type Props = {
  costByCurrency: Record<string, number>
  groups: HoldingGroup[]
  amountsVisible: boolean
  onToggleVisibility: () => void
  totalInBase: number
  totalMarketValueInBase: number
  totalGainLoss: number
  totalGainLossPct: number | null
}

const PAGE_COUNT = 2
const { width: SCREEN_WIDTH } = Dimensions.get('window')

export function PortfolioSummary({ costByCurrency, groups, amountsVisible, onToggleVisibility, totalInBase, totalMarketValueInBase, totalGainLoss, totalGainLossPct }: Props) {
  const colors = useThemeColors()
  const { t } = useTranslation('portfolio')
  const baseCurrency = usePreferences((s) => s.baseCurrency)
  const [activeIndex, setActiveIndex] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setActiveIndex(index)
  }, [])

  const chartData = groups
    .filter((g) => g.totalValue > 0)
    .map((g) => ({
      color: g.assetClass?.color ?? '#636366',
      value: g.totalValue,
      label: g.assetClass?.name ?? g.type,
    }))

  const currencies = Object.entries(costByCurrency)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)

  return (
    <DirectionalView className="pt-4 pb-2">
      {/* Header row */}
      <View className="px-5 mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-text">
          {t('common:hello_investor')}
        </Text>
        <Pressable
          className="flex-row items-center gap-1.5 active:opacity-70 border border-muted rounded-lg px-3 py-1"
          onPress={onToggleVisibility}
        >
          <Text className="text-sm text-muted">{t('toggle_amounts')}</Text>
          {amountsVisible ? (
            <IconEye size={18} color={colors.muted} />
          ) : (
            <IconEyeOff size={18} color={colors.muted} />
          )}
        </Pressable>
      </View>

      {/* Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Page 1: Pie chart + cost basis */}
        <View
          style={{ width: SCREEN_WIDTH }}
          onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}
        >
          <View className="px-5 flex-row items-center">
            {chartData.length > 0 && <AllocationChart groups={chartData} size={150} />}
            <View className="flex-1 items-end">
              <Text className="text-sm font-semibold uppercase tracking-wider text-muted">
                {t('total_cost_basis')}
              </Text>
              {currencies.length === 0 ? (
                <Redacted visible={amountsVisible}>
                  <Text
                    className="text-3xl font-bold text-text mt-1"
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    0
                  </Text>
                </Redacted>
              ) : currencies.length === 1 ? (
                <>
                  <Redacted visible={amountsVisible}>
                    <Text
                      className="text-3xl font-bold text-text mt-1"
                      style={{ fontVariant: ['tabular-nums'] }}
                    >
                      {currencies[0][1].toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </Text>
                  </Redacted>
                  <Text className="text-sm text-muted mt-0.5">{currencies[0][0]}</Text>
                </>
              ) : (
                <View className="items-end mt-1 gap-0.5">
                  {currencies.map(([currency, amount]) => (
                    <View key={currency} className="flex-row items-baseline gap-1.5">
                      <Redacted visible={amountsVisible}>
                        <Text
                          className="text-2xl font-bold text-text"
                          style={{ fontVariant: ['tabular-nums'] }}
                        >
                          {amount.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </Text>
                      </Redacted>
                      <Text className="text-sm text-muted">{currency}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Page 2: Overview card (brand mock style) */}
        <View style={{ width: SCREEN_WIDTH, minHeight: pageHeight }}>
          <PortfolioOverviewCard
            costByCurrency={costByCurrency}
            groups={groups}
            amountsVisible={amountsVisible}
            baseCurrency={baseCurrency}
            totalInBase={totalInBase}
            totalMarketValueInBase={totalMarketValueInBase}
            totalGainLoss={totalGainLoss}
            totalGainLossPct={totalGainLossPct}
          />
        </View>
      </ScrollView>

      {/* Page dots */}
      <View className="flex-row items-center justify-center gap-2 mt-3">
        {Array.from({ length: PAGE_COUNT }).map((_, i) => (
          <View
            key={i}
            className="rounded-full"
            style={{
              width: activeIndex === i ? 16 : 6,
              height: 6,
              backgroundColor: activeIndex === i ? colors.text : colors.subtle,
            }}
          />
        ))}
      </View>
    </DirectionalView>
  )
}
