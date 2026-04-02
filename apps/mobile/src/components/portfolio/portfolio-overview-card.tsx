import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import type { HoldingGroup } from '@/src/hooks/use-holdings'
import { useThemeColors } from '@/src/theme/colors'
import { Redacted } from './redacted'

type Props = {
  costByCurrency: Record<string, number>
  groups: HoldingGroup[]
  amountsVisible: boolean
  baseCurrency: string
  totalInBase: number
  totalMarketValueInBase: number
  totalGainLoss: number
  totalGainLossPct: number | null
}

export function PortfolioOverviewCard({
  costByCurrency,
  groups,
  amountsVisible,
  baseCurrency,
  totalInBase,
  totalMarketValueInBase,
  totalGainLoss,
  totalGainLossPct,
}: Props) {
  const colors = useThemeColors()
  const { t } = useTranslation('portfolio')

  const chartData = groups
    .filter((g) => g.totalValue > 0)
    .map((g) => ({
      color: g.assetClass?.color ?? '#636366',
      value: g.totalValue,
      label: g.assetClass?.name ?? g.type,
    }))

  const chartTotal = chartData.reduce((sum, d) => sum + d.value, 0)
  const hasGainLoss = totalGainLossPct != null && totalGainLoss !== 0
  const gainColor = totalGainLoss >= 0 ? '#34c759' : '#ff3b30'

  return (
    <View className="flex-1 px-4">
      <View className="flex-1 rounded-2xl p-4 justify-between" style={{ backgroundColor: colors.card }}>
        {/* Top: Market Value + Cost Basis + Gain/Loss */}
        <View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-medium text-muted">{t('total_value')}</Text>
            {Object.keys(costByCurrency).length > 1 && (
              <Text className="text-[10px]" style={{ color: '#c8874a' }}>
                {t('converted_to_base', { currency: baseCurrency })}
              </Text>
            )}
          </View>
          <Redacted visible={amountsVisible}>
            <Text
              className="text-3xl font-bold text-text mt-1"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {baseCurrency} {totalMarketValueInBase.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
          </Redacted>

          <Redacted visible={amountsVisible}>
            <Text className="text-xs text-muted mt-1" style={{ fontVariant: ['tabular-nums'] }}>
              {t('cost_basis')}: {baseCurrency} {totalInBase.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
          </Redacted>

          {hasGainLoss && (
            <Redacted visible={amountsVisible}>
              <Text
                className="text-sm font-semibold mt-1"
                style={{ fontVariant: ['tabular-nums'], color: gainColor }}
              >
                {totalGainLoss >= 0 ? '+' : ''}{totalGainLoss.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })} ({totalGainLossPct! >= 0 ? '+' : ''}{totalGainLossPct!.toFixed(1)}%)
              </Text>
            </Redacted>
          )}
        </View>

        {/* Bottom: Allocation Bar + Legend */}
        {chartTotal > 0 && (
          <View>
            <View className="flex-row gap-0.5 h-2 rounded-full overflow-hidden">
              {chartData.map((seg) => (
                <View
                  key={seg.label}
                  style={{
                    flex: seg.value / chartTotal,
                    backgroundColor: seg.color,
                  }}
                />
              ))}
            </View>

            <View className="flex-row flex-wrap gap-x-4 gap-y-1 mt-2">
              {chartData.map((seg) => (
                <View key={seg.label} className="flex-row items-center gap-1.5">
                  <View
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <Text className="text-xs text-muted">{seg.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
