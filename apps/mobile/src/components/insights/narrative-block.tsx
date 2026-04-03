import { ActivityIndicator, Text, View } from 'react-native'
import { Pressable } from 'react-native'
import {
  IconSparkles,
  IconThumbUp,
  IconAlertTriangle,
  IconRefresh,
} from '@tabler/icons-react-native'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import type { NarrativeData } from '@/src/types/insights'
import { InsightBullet } from './insight-bullet'

type Props = {
  narrative: NarrativeData | null
  isStale?: boolean
  isLoading?: boolean
  creditCost?: number
  onGenerate: () => void
}

export function NarrativeBlock({
  narrative,
  isStale = false,
  isLoading = false,
  creditCost = 1,
  onGenerate,
}: Props) {
  const colors = useThemeColors()
  const { t } = useTranslation('insights')

  // --- Loading state ---
  if (isLoading) {
    return (
      <View className="bg-card rounded-2xl mx-4 p-4">
        <View className="flex-row items-center gap-2 mb-3">
          <IconSparkles size={18} color={colors.accent} />
          <Text className="text-sm font-semibold text-text">{t('ai_narrative')}</Text>
        </View>
        <View className="flex-row items-center justify-center gap-2 py-4">
          <ActivityIndicator size="small" color={colors.accent} />
          <Text className="text-sm text-muted">{t('generating_narrative')}</Text>
        </View>
      </View>
    )
  }

  // --- No narrative yet (first time or empty) ---
  if (!narrative) {
    return (
      <View className="bg-card rounded-2xl mx-4 p-4">
        <View className="flex-row items-center gap-2 mb-2">
          <IconSparkles size={18} color={colors.accent} />
          <Text className="text-sm font-semibold text-text">{t('ai_narrative')}</Text>
        </View>

        <Text className="text-sm text-muted mb-4">
          {t('ai_narrative_description')}
        </Text>

        <Pressable
          className="flex-row items-center justify-center gap-2 bg-accent/15 rounded-xl py-3 active:opacity-70"
          onPress={onGenerate}
        >
          <IconSparkles size={16} color={colors.accent} />
          <Text className="text-sm font-semibold" style={{ color: colors.accent }}>
            {t('generate_with_ai')}
          </Text>
          {creditCost > 0 && (
            <View className="bg-accent/20 rounded-md px-1.5 py-0.5">
              <Text className="text-xs font-medium" style={{ color: colors.accent }}>
                {t('credits', { count: creditCost })}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    )
  }

  // --- Has narrative — full content ---
  return (
    <View className="mx-4 gap-3">
      {/* Summary Card */}
      <View className="bg-card rounded-2xl p-4 overflow-hidden">
        <View
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: colors.accent }}
        />
        <View className="flex-row items-center gap-2 mb-2">
          <IconSparkles size={16} color={colors.accent} />
          <Text className="text-sm font-semibold text-text">{t('summary')}</Text>
          <View className="bg-accent/15 rounded px-1.5 py-0.5 ml-auto">
            <Text className="text-[10px] text-muted">{t('ai_generated')}</Text>
          </View>
        </View>
        <Text className="text-base text-text leading-6 text-justify">{narrative.summary}</Text>

        {isStale && (
          <Pressable
            className="flex-row items-center gap-1.5 mt-3 pt-3 border-t border-border active:opacity-70"
            onPress={onGenerate}
          >
            <IconRefresh size={14} color={colors.accent} />
            <Text className="text-xs" style={{ color: colors.accent }}>
              {t('narrative_refresh')}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Strengths Card */}
      {narrative.strengths.length > 0 && (
        <View className="bg-card rounded-2xl p-4 overflow-hidden">
          <View
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: '#34c759' }}
          />
          <View className="flex-row items-center gap-2 mb-2">
            <IconThumbUp size={16} color="#34c759" />
            <Text className="text-sm font-semibold text-text">{t('strengths')}</Text>
          </View>
          {narrative.strengths.map((item, i) => (
            <InsightBullet key={i} text={item} />
          ))}
        </View>
      )}

      {/* Improvements Card */}
      {narrative.improvements.length > 0 && (
        <View className="bg-card rounded-2xl p-4 overflow-hidden">
          <View
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: '#ff9500' }}
          />
          <View className="flex-row items-center gap-2 mb-2">
            <IconAlertTriangle size={16} color="#ff9500" />
            <Text className="text-sm font-semibold text-text">{t('areas_to_improve')}</Text>
          </View>
          {narrative.improvements.map((item, i) => (
            <InsightBullet key={i} text={item} />
          ))}
        </View>
      )}
    </View>
  )
}
