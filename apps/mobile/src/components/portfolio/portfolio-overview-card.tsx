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
}

export function PortfolioOverviewCard({ costByCurrency, groups, amountsVisible, baseCurrency }: Props) {
  const colors = useThemeColors()
  const { t } = useTranslation('portfolio')

  const totalValue = Object.values(costByCurrency).reduce((sum, v) => sum + v, 0)
  const costBasisInBase = costByCurrency[baseCurrency] ?? totalValue

  const chartData = groups
    .filter((g) => g.totalValue > 0)
    .map((g) => ({
      color: g.assetClass?.color ?? '#636366',
      value: g.totalValue,
      label: g.assetClass?.name ?? g.type,
    }))

  const chartTotal = chartData.reduce((sum, d) => sum + d.value, 0)

  return (
    <View className="flex-1 px-4">
      <View className="flex-1 rounded-2xl p-4 justify-between" style={{ backgroundColor: colors.card }}>
        {/* Top: Value + Cost Basis */}
        <View>
          <Text className="text-xs font-medium text-muted">{t('total_value')}</Text>
          <Redacted visible={amountsVisible}>
            <Text
              className="text-3xl font-bold text-text mt-1"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {baseCurrency} {costBasisInBase.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
          </Redacted>

          <Redacted visible={amountsVisible}>
            <Text className="text-xs text-muted mt-1" style={{ fontVariant: ['tabular-nums'] }}>
              {t('cost_basis')}: {baseCurrency} {costBasisInBase.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
          </Redacted>
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
