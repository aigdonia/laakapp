import { Pressable, Text, View } from 'react-native'
import { IconShieldCheck } from '@tabler/icons-react-native'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import type { ComplianceSummary } from '@/src/types/insights'

type Props = {
  compliance: ComplianceSummary
  onPress: () => void
}

export function ShariaComplianceCard({ compliance, onPress }: Props) {
  const colors = useThemeColors()
  const { compliant, nonCompliant, notScreened, total } = compliance
  const { t } = useTranslation('insights')

  // Traffic bar widths as percentages
  const compliantPct = total > 0 ? (compliant / total) * 100 : 0
  const nonCompliantPct = total > 0 ? (nonCompliant / total) * 100 : 0
  const notScreenedPct = total > 0 ? (notScreened / total) * 100 : 0

  return (
    <Pressable
      className="bg-card rounded-2xl mx-4 p-4 active:opacity-70"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-2 mb-3">
        <IconShieldCheck size={18} color={colors.muted} />
        <Text className="text-sm font-semibold text-text">{t('sharia_compliance')}</Text>
      </View>

      {/* Traffic-light bar */}
      <View className="flex-row h-3 rounded-full overflow-hidden bg-subtle/15">
        {compliantPct > 0 && (
          <View
            className="h-3"
            style={{ width: `${compliantPct}%`, backgroundColor: '#34c759' }}
          />
        )}
        {nonCompliantPct > 0 && (
          <View
            className="h-3"
            style={{ width: `${nonCompliantPct}%`, backgroundColor: '#ff3b30' }}
          />
        )}
        {notScreenedPct > 0 && (
          <View
            className="h-3"
            style={{ width: `${notScreenedPct}%`, backgroundColor: colors.subtle, opacity: 0.4 }}
          />
        )}
      </View>

      {/* Legend */}
      <View className="flex-row items-center gap-4 mt-3">
        <Text className="text-sm text-text">
          <Text className="font-semibold">{compliant}</Text>
          <Text className="text-muted"> {t('of_total_compliant', { total })}</Text>
        </Text>
      </View>

      {/* Mini legend dots */}
      <View className="flex-row items-center gap-4 mt-2">
        {compliant > 0 && (
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#34c759' }} />
            <Text className="text-xs text-muted">{t('compliant')}</Text>
          </View>
        )}
        {nonCompliant > 0 && (
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ff3b30' }} />
            <Text className="text-xs text-muted">{t('non_compliant')}</Text>
          </View>
        )}
        {notScreened > 0 && (
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-subtle/40" />
            <Text className="text-xs text-muted">{t('not_screened')}</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}
