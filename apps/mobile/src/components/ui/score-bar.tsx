import { View } from 'react-native'

import { useThemeColors } from '@/src/theme/colors'

type Props = {
  /** Current value as percentage (0-100) */
  value: number
  /** Bar fill color */
  color: string
  /** Target percentage (0-100). When set, shows a marker line and dims overflow. */
  target?: number
  /** Whether the bar has meaningful data. When false, fill renders at 15% opacity. */
  active?: boolean
}

/**
 * A progress bar with optional target marker.
 *
 * Without `target`: simple filled bar (e.g. health factor scores).
 * With `target`: splits fill into solid (up to target) and dimmed (overflow),
 * with a vertical marker line at the target position.
 */
export function ScoreBar({ value, color, target, active = true }: Props) {
  const colors = useThemeColors()
  const clamped = Math.min(value, 100)
  const hasTarget = target != null
  const isOver = hasTarget && value > target + 0.5

  if (!hasTarget) {
    return (
      <View className="h-3.5 rounded-full bg-subtle/15 overflow-hidden">
        <View
          className="h-3.5 rounded-full"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </View>
    )
  }

  return (
    <View className="h-3.5 rounded-full overflow-hidden">
      {/* Background: normal zone (up to target) */}
      <View
        className="absolute h-3.5"
        style={{ width: `${target}%`, backgroundColor: colors.subtle, opacity: 0.15 }}
      />
      {/* Background: beyond target */}
      <View
        className="absolute h-3.5 rounded-r-full"
        style={{
          left: `${target}%`,
          width: `${100 - target}%`,
          backgroundColor: colors.subtle,
          opacity: 0.15,
        }}
      />
      {/* Solid fill: up to min(value, target) */}
      <View
        className="absolute h-3.5 rounded-l-full"
        style={{
          width: `${Math.min(clamped, target)}%`,
          backgroundColor: color,
          opacity: active ? 1 : 0.15,
          borderTopRightRadius: clamped <= target ? 9999 : 0,
          borderBottomRightRadius: clamped <= target ? 9999 : 0,
        }}
      />
      {/* Overflow fill: from target to value (dimmed) */}
      {isOver && (
        <View
          className="absolute h-3.5 rounded-r-full"
          style={{
            left: `${target}%`,
            width: `${Math.min(clamped - target, 100 - target)}%`,
            backgroundColor: color,
            opacity: 0.3,
          }}
        />
      )}
      {/* Target marker line */}
      <View
        className="absolute h-4 w-0.5 rounded-full"
        style={{
          left: `${target}%`,
          top: -1,
          backgroundColor: colors.text,
          opacity: 0.4,
        }}
      />
    </View>
  )
}
