import { useEffect, useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'
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

// Layout constants
const SIZE = 240
const STROKE = 14
const RADIUS = (SIZE - STROKE) / 2 - 20 // leave room for labels outside
const CENTER = SIZE / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP_DEG = 6 // gap in degrees between segments

/** Color based on fill ratio (how much of ideal is met) */
function segmentColor(fillRatio: number, assetColor: string): string {
  if (fillRatio >= 0.75) return '#34c759' // green — near/at ideal
  if (fillRatio >= 0.4) return '#ff9500'  // orange — partial
  if (fillRatio > 0) return '#ff3b30'     // red — low
  return assetColor // fallback (won't show, 0 fill)
}

/** Convert degrees to radians */
function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

/** Position for label at angle (degrees, 0 = top / 12 o'clock) */
function labelPosition(angleDeg: number, r: number) {
  const rad = degToRad(angleDeg - 90) // SVG starts at 3 o'clock, shift to 12
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  }
}

type Segment = {
  slug: string
  name: string
  color: string
  fillRatio: number // 0-1
  startDeg: number
  arcDeg: number
}

export function PortfolioScoreGauge({ score, onPress }: Props) {
  const colors = useThemeColors()
  const scoreColor = getScoreColor(score.zone)
  const scoreLabelKey = getScoreLabel(score.zone)
  const { t } = useTranslation('insights')

  // Animated score counter
  const animatedScore = useSharedValue(0)
  useEffect(() => {
    animatedScore.value = withTiming(score.total, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    })
  }, [score.total, animatedScore])

  // Build segments — arc size proportional to idealPct (preset-aware)
  const MIN_ARC_DEG = 15 // minimum for 0% ideal classes
  const segments = useMemo<Segment[]>(() => {
    const classes = score.classes
    if (classes.length === 0) return []

    const totalGapDeg = GAP_DEG * classes.length
    const availableDeg = 360 - totalGapDeg
    const zeroClasses = classes.filter((c) => c.idealPct === 0).length
    const hasPreset = classes.some((c) => c.idealPct !== classes[0]?.idealPct)

    // If all idealPct are equal (no preset), use equal arcs
    if (!hasPreset) {
      const arcPerClass = availableDeg / classes.length
      let cursor = 0
      return classes.map((cls) => {
        const startDeg = cursor
        cursor += arcPerClass + GAP_DEG
        const fillRatio = cls.idealPct > 0
          ? Math.min(cls.actualPct / cls.idealPct, 1)
          : 0
        return { slug: cls.slug, name: cls.name, color: cls.color, fillRatio, startDeg, arcDeg: arcPerClass }
      })
    }

    // Proportional arcs for preset mode
    const reservedDeg = MIN_ARC_DEG * zeroClasses
    const distributableDeg = availableDeg - reservedDeg
    const totalIdealPct = classes.reduce((sum, c) => sum + c.idealPct, 0)

    let cursor = 0
    return classes.map((cls) => {
      const arcDeg = cls.idealPct > 0 && totalIdealPct > 0
        ? (cls.idealPct / totalIdealPct) * distributableDeg
        : MIN_ARC_DEG
      const startDeg = cursor
      cursor += arcDeg + GAP_DEG
      const fillRatio = cls.idealPct > 0
        ? Math.min(cls.actualPct / cls.idealPct, 1)
        : 0
      return { slug: cls.slug, name: cls.name, color: cls.color, fillRatio, startDeg, arcDeg }
    })
  }, [score.classes])

  // Round linecap extends STROKE/2 beyond each arc end.
  // Shrink the drawn arc by that amount on each side so caps stay within bounds.
  const CAP_COMPENSATION = STROKE / 2

  // Convert degrees to stroke-dasharray/offset for an arc segment
  const degToStroke = (startDeg: number, arcDeg: number) => {
    const fullArcLength = (arcDeg / 360) * CIRCUMFERENCE
    const arcLength = Math.max(fullArcLength - CAP_COMPENSATION * 2, 0)
    const gapLength = CIRCUMFERENCE - arcLength
    // strokeDashoffset rotates the start — SVG circle starts at 3 o'clock
    // We want 0° = 12 o'clock, so shift by -90°
    // Also shift by +CAP_COMPENSATION so the inset arc stays centered in its slot
    const offsetDeg = 360 - startDeg + 90
    const offset = (offsetDeg / 360) * CIRCUMFERENCE + CAP_COMPENSATION
    return { dasharray: `${arcLength} ${gapLength}`, dashoffset: offset }
  }

  const LABEL_RADIUS = RADIUS + STROKE / 2 + 14

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
          {segments.map((seg) => {
            const track = degToStroke(seg.startDeg, seg.arcDeg)
            const fillArcDeg = seg.arcDeg * seg.fillRatio
            const fill = degToStroke(seg.startDeg, fillArcDeg)
            const fillColor = seg.fillRatio > 0
              ? segmentColor(seg.fillRatio, seg.color)
              : 'transparent'

            return (
              <G key={seg.slug}>
                {/* Track (grey background for the full segment arc) */}
                <Circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={colors.subtle}
                  strokeWidth={STROKE}
                  strokeDasharray={track.dasharray}
                  strokeDashoffset={track.dashoffset}
                  strokeLinecap="round"
                  opacity={0.15}
                />

                {/* Filled portion (contribution) */}
                {seg.fillRatio > 0 && (
                  <Circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke={fillColor}
                    strokeWidth={STROKE}
                    strokeDasharray={fill.dasharray}
                    strokeDashoffset={fill.dashoffset}
                    strokeLinecap="round"
                  />
                )}
              </G>
            )
          })}
        </Svg>

        {/* Labels positioned around the outside */}
        {segments.map((seg) => {
          const midDeg = seg.startDeg + seg.arcDeg / 2
          const pos = labelPosition(midDeg, LABEL_RADIUS)
          return (
            <Text
              key={`label-${seg.slug}`}
              className="absolute text-[10px] font-medium text-muted"
              style={{
                left: pos.x,
                top: pos.y,
                transform: [{ translateX: -20 }, { translateY: -7 }],
                width: 40,
                textAlign: 'center',
              }}
            >
              {seg.name}
            </Text>
          )
        })}

        {/* Score number centered */}
        <View
          className="absolute items-center justify-center"
          style={{ top: 0, bottom: 0, left: 0, right: 0 }}
        >
          <Text
            className="text-5xl font-bold"
            style={{ color: scoreColor, fontVariant: ['tabular-nums'] }}
          >
            {score.total}
          </Text>
          <Text className="text-sm font-medium text-muted mt-0.5">
            {t(scoreLabelKey)}
          </Text>
        </View>
      </View>

      <Text className="text-xs text-subtle mt-1">{t('tap_for_breakdown')}</Text>
    </Pressable>
  )
}
