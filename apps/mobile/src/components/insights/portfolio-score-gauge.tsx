import { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useTranslation } from 'react-i18next'

import type { PortfolioScore } from '@/src/types/insights'
import { getScoreColor, getScoreLabel } from '@/src/types/insights'
import { useThemeColors } from '@/src/theme/colors'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

type Props = {
  score: PortfolioScore
  onPress: () => void
}

const SIZE = 200
const STROKE = 16
const RADIUS = (SIZE - STROKE) / 2
const CENTER = SIZE / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function PortfolioScoreGauge({ score, onPress }: Props) {
  const colors = useThemeColors()
  const scoreColor = getScoreColor(score.zone)
  const scoreLabelKey = getScoreLabel(score.zone)
  const { t } = useTranslation('insights')

  // Animated score progress (thin inner ring)
  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withTiming(score.total / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    })
  }, [score.total, progress])

  const animatedScoreProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }))

  // Build allocation segments from classes that have actual holdings
  const activeClasses = score.classes.filter((c) => c.actualPct > 0)
  const totalActual = activeClasses.reduce((sum, c) => sum + c.actualPct, 0)

  // Compute donut segments
  let accumulated = 0
  const segments = activeClasses.map((cls) => {
    const ratio = cls.actualPct / totalActual
    const dashLength = ratio * CIRCUMFERENCE
    // Rotate -90° so first segment starts at top
    const dashOffset = -(accumulated * CIRCUMFERENCE) + CIRCUMFERENCE * 0.25
    accumulated += ratio
    return { ...cls, dashLength, dashOffset }
  })

  // Inner ring for score (thinner, inside the donut)
  const INNER_RADIUS = RADIUS - STROKE - 4
  const INNER_CIRC = 2 * Math.PI * INNER_RADIUS

  return (
    <Pressable
      className="items-center bg-card rounded-2xl mx-4 pt-5 pb-4 active:opacity-70"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPress()
      }}
    >
      <View className="items-center" style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          {/* Background track */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={colors.subtle}
            strokeWidth={STROKE}
            opacity={0.1}
          />

          {/* Asset class allocation segments (outer donut) */}
          {segments.map((seg) => (
            <Circle
              key={seg.slug}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${seg.dashLength} ${CIRCUMFERENCE - seg.dashLength}`}
              strokeDashoffset={seg.dashOffset}
            />
          ))}

          {/* Inner score ring — background */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RADIUS}
            fill="none"
            stroke={colors.subtle}
            strokeWidth={4}
            opacity={0.1}
          />

          {/* Inner score ring — animated progress */}
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RADIUS}
            fill="none"
            stroke={scoreColor}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={`${INNER_CIRC} ${INNER_CIRC}`}
            animatedProps={animatedScoreProps}
            // Rotate so it starts from top
            rotation={-90}
            origin={`${CENTER}, ${CENTER}`}
          />
        </Svg>

        {/* Score number centered */}
        <View className="absolute items-center justify-center" style={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <Text
            className="text-5xl font-bold"
            style={{ color: scoreColor, fontVariant: ['tabular-nums'] }}
          >
            {score.total}
          </Text>
          <Text className="text-sm font-medium text-muted mt-0.5">{t(scoreLabelKey)}</Text>
        </View>
      </View>

      {/* Asset class legend */}
      <View className="flex-row flex-wrap justify-center gap-x-4 gap-y-1 mt-2 px-4">
        {activeClasses.map((cls) => (
          <View key={cls.slug} className="flex-row items-center gap-1.5">
            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cls.color }} />
            <Text className="text-xs text-muted">
              {cls.name} {Math.round(cls.actualPct)}%
            </Text>
          </View>
        ))}
      </View>

      <Text className="text-xs text-subtle mt-2">{t('tap_for_breakdown')}</Text>
    </Pressable>
  )
}
