import { forwardRef } from 'react'
import { Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import type { HealthFactor, PortfolioScore } from '@/src/types/insights'
import { getScoreColor } from '@/src/types/insights'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

type Props = {
  score: PortfolioScore | null
  factors: HealthFactor[] | null | undefined
}

export const ScoreBreakdownSheet = forwardRef<BottomSheetModal, Props>(
  function ScoreBreakdownSheet({ score, factors }, ref) {
    const colors = useThemeColors()
    const { t } = useTranslation('insights')

    if (!score) return null

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['65%', '90%']}
        backdropComponent={Backdrop}
        backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
        handleIndicatorStyle={{ backgroundColor: colors.muted }}
      >
        <BottomSheetScrollView className="px-5 pb-10 pt-2">
          <Text className="text-lg font-semibold text-text mb-1">{t('score_breakdown')}</Text>
          <Text className="text-sm text-muted mb-5">
            {t('score_breakdown_description')}
          </Text>

          {score.classes.map((cls) => {
            const hasHoldings = cls.actualPct > 0
            const isCapped = cls.actualPct >= cls.idealPct

            return (
              <View key={cls.slug} className="mb-4">
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cls.color }}
                    />
                    <Text className="text-sm font-medium text-text">{cls.name}</Text>
                  </View>
                  <Text
                    className="text-sm font-bold"
                    style={{
                      color: hasHoldings ? cls.color : colors.subtle,
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    +{cls.contribution}
                  </Text>
                </View>

                {/* Bar: shows actual % with ideal marker */}
                <View className="h-2 rounded-full bg-subtle/15 overflow-hidden">
                  <View
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(cls.actualPct, 100)}%`,
                      backgroundColor: cls.color,
                      opacity: hasHoldings ? 1 : 0.15,
                    }}
                  />
                </View>

                {/* Labels row */}
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-xs text-muted">
                    {hasHoldings
                      ? t('allocated', { pct: cls.actualPct })
                      : t('not_in_portfolio')}
                  </Text>
                  <Text className="text-xs text-subtle">
                    {isCapped
                      ? t('maxed_at', { pct: cls.idealPct })
                      : t('target', { pct: cls.idealPct })}
                  </Text>
                </View>
              </View>
            )
          })}

          <View className="border-t border-border pt-4 mt-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-text">{t('diversification_score')}</Text>
              <Text
                className="text-2xl font-bold"
                style={{ color: getScoreColor(score.zone), fontVariant: ['tabular-nums'] }}
              >
                {score.total}
              </Text>
            </View>
            <Text className="text-xs text-muted mt-1">
              {t('diversification_description')}
            </Text>
          </View>

          {/* Health Factors (computed via DuckDB) */}
          {factors && factors.length > 0 && (
            <>
              <Text className="text-base font-semibold text-text mt-6 mb-4">
                {t('health_factors')}
              </Text>

              {factors.map((factor) => {
                const barColor = factor.score >= 75 ? '#34c759'
                  : factor.score >= 50 ? '#ff9500'
                  : '#ff3b30'

                return (
                  <View key={factor.name} className="mb-4">
                    <View className="flex-row items-center justify-between mb-1.5">
                      <Text className="text-sm font-medium text-text">{factor.name}</Text>
                      <Text
                        className="text-sm font-bold"
                        style={{ color: barColor, fontVariant: ['tabular-nums'] }}
                      >
                        {factor.score}
                      </Text>
                    </View>

                    <View className="h-2 rounded-full bg-subtle/15 overflow-hidden">
                      <View
                        className="h-2 rounded-full"
                        style={{
                          width: `${factor.score}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </View>

                    <Text className="text-xs text-muted mt-1">{factor.description}</Text>
                  </View>
                )
              })}
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  },
)
