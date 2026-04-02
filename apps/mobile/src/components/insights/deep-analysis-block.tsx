import { ActivityIndicator, Text, View } from 'react-native'
import { Pressable } from 'react-native'
import {
  IconSparkles,
  IconThumbUp,
  IconAlertTriangle,
  IconRefresh,
  IconLock,
} from '@tabler/icons-react-native'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import type { NarrativeData } from '@/src/types/insights'
import { InsightBullet } from './insight-bullet'

type Props = {
  analysis: NarrativeData | null
  isStale?: boolean
  isLoading?: boolean
  creditCost?: number
  onGenerate: () => void
}

export function DeepAnalysisBlock({
  analysis,
  isStale = false,
  isLoading = false,
  creditCost = 3,
  onGenerate,
}: Props) {
  const colors = useThemeColors()
  const { t } = useTranslation('insights')

  // --- Loading ---
  if (isLoading) {
    return (
      <View className="bg-card rounded-2xl mx-4 p-4">
        <View className="flex-row items-center gap-2 mb-3">
          <IconSparkles size={18} color={colors.accent} />
          <Text className="text-sm font-semibold text-text">{t('deep_analysis')}</Text>
        </View>
        <View className="flex-row items-center justify-center gap-2 py-4">
          <ActivityIndicator size="small" color={colors.accent} />
          <Text className="text-sm text-muted">{t('generating_narrative')}</Text>
        </View>
      </View>
    )
  }

  // --- Locked ---
  if (!analysis) {
    return (
      <View className="bg-card rounded-2xl mx-4 p-4">
        <View className="flex-row items-center gap-2 mb-2">
          <IconSparkles size={18} color={colors.accent} />
          <Text className="text-sm font-semibold text-text">{t('deep_analysis')}</Text>
        </View>

        <Text className="text-sm text-muted mb-4">
          {t('deep_analysis_description')}
        </Text>

        <Pressable
          className="flex-row items-center justify-center gap-2 bg-accent/15 rounded-xl py-3 active:opacity-70"
          onPress={onGenerate}
        >
          <IconLock size={16} color={colors.accent} />
          <Text className="text-sm font-semibold" style={{ color: colors.accent }}>
            {t('unlock_deep_analysis')}
          </Text>
          <View className="bg-accent/20 rounded-md px-1.5 py-0.5">
            <Text className="text-xs font-medium" style={{ color: colors.accent }}>
              {t('credits', { count: creditCost })}
            </Text>
          </View>
        </Pressable>
      </View>
    )
  }

  // --- Content ---
  return (
    <View className="mx-4 gap-3">
      {/* Summary */}
      <View className="bg-card rounded-2xl p-4 overflow-hidden">
        <View
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: colors.accent }}
        />
        <View className="flex-row items-center gap-2 mb-2">
          <IconSparkles size={16} color={colors.accent} />
          <Text className="text-sm font-semibold text-text">{t('deep_analysis')}</Text>
          <View className="bg-accent/15 rounded px-1.5 py-0.5 ml-auto">
            <Text className="text-[10px] text-muted">{t('ai_generated')}</Text>
          </View>
        </View>
        <Text className="text-sm text-text leading-5">{analysis.summary}</Text>

        {isStale && (
          <Pressable
            className="flex-row items-center gap-1.5 mt-3 pt-3 border-t border-border"
            onPress={onGenerate}
          >
            <IconRefresh size={14} color={colors.accent} />
            <Text className="text-xs" style={{ color: colors.accent }}>
              {t('narrative_refresh')}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <View className="bg-card rounded-2xl p-4 overflow-hidden">
          <View
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: '#34c759' }}
          />
          <View className="flex-row items-center gap-2 mb-2">
            <IconThumbUp size={16} color="#34c759" />
            <Text className="text-sm font-semibold text-text">{t('strengths')}</Text>
          </View>
          {analysis.strengths.map((item, i) => (
            <InsightBullet key={i} text={item} />
          ))}
        </View>
      )}

      {/* Improvements */}
      {analysis.improvements.length > 0 && (
        <View className="bg-card rounded-2xl p-4 overflow-hidden">
          <View
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: '#ff9500' }}
          />
          <View className="flex-row items-center gap-2 mb-2">
            <IconAlertTriangle size={16} color="#ff9500" />
            <Text className="text-sm font-semibold text-text">{t('areas_to_improve')}</Text>
          </View>
          {analysis.improvements.map((item, i) => (
            <InsightBullet key={i} text={item} />
          ))}
        </View>
      )}
    </View>
  )
}
