import { Text, View } from 'react-native'
import { IconChartBar } from '@tabler/icons-react-native'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import type { ConcentrationInsight } from '@/src/types/insights'

type Props = {
  concentration: ConcentrationInsight
}

export function ConcentrationCard({ concentration }: Props) {
  const colors = useThemeColors()
  const { topHolding, segments, verdict } = concentration
  const { t } = useTranslation('insights')

  return (
    <View className="bg-card rounded-2xl mx-4 p-4">
      <View className="flex-row items-center gap-2 mb-3">
        <IconChartBar size={18} color={colors.muted} />
        <Text className="text-sm font-semibold text-text">{t('concentration')}</Text>
      </View>

      {/* Stacked bar */}
      <View className="flex-row h-3 rounded-full overflow-hidden bg-subtle/15">
        {segments.map((seg) => (
          <View
            key={seg.label}
            className="h-3"
            style={{ width: `${seg.percentage}%`, backgroundColor: seg.color }}
          />
        ))}
      </View>

      {/* Verdict */}
      <Text className="text-sm text-text mt-3">{verdict}</Text>

      {/* Top holding callout */}
      {topHolding && (
        <Text className="text-xs text-muted mt-1">
          {t('top_holding_callout', { name: topHolding.name, percentage: topHolding.percentage })}
        </Text>
      )}
    </View>
  )
}
