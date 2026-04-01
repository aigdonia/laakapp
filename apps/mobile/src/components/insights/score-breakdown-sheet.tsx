import { forwardRef } from 'react'
import { Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'

import { ScoreBar } from '@/src/components/ui/score-bar'
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
            const deviation = Math.round((cls.actualPct - cls.idealPct) * 10) / 10
            const isOver = deviation > 0.5
            const isUnder = deviation < -0.5

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
                  {isOver && (
                    <Text
                      className="text-sm font-bold"
                      style={{ color: '#ff9500', fontVariant: ['tabular-nums'] }}
                    >
                      +{deviation}%
                    </Text>
                  )}
                  {isUnder && (
                    <Text
                      className="text-sm font-bold"
                      style={{ color: colors.muted, fontVariant: ['tabular-nums'] }}
                    >
                      {deviation}%
                    </Text>
                  )}
                </View>

                <ScoreBar
                  value={cls.actualPct}
                  color={cls.color}
                  target={cls.idealPct}
                  active={hasHoldings}
                />

                {/* Labels row */}
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-xs text-muted">
                    {hasHoldings
                      ? t('allocated', { pct: cls.actualPct })
                      : t('not_in_portfolio')}
                  </Text>
                  <Text className="text-xs text-subtle">
                    {t('target', { pct: cls.idealPct })}
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

                    <ScoreBar value={factor.score} color={barColor} />

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
