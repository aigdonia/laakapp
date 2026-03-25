import { View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

type Segment = {
  color: string
  value: number
  label: string
}

type Props = {
  groups: Segment[]
  size?: number
}

const STROKE_WIDTH = 20

export function AllocationChart({ groups, size = 160 }: Props) {
  const radius = (size - STROKE_WIDTH) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  const total = groups.reduce((sum, g) => sum + g.value, 0)

  if (total === 0) return null

  let accumulated = 0
  const segments = groups.map((g) => {
    const ratio = g.value / total
    const dashLength = ratio * circumference
    const dashOffset = -(accumulated * circumference) + circumference * 0.25
    accumulated += ratio
    return { ...g, dashLength, dashOffset }
  })

  return (
    <View className="items-center py-4">
      <Svg width={size} height={size}>
        {segments.map((seg) => (
          <Circle
            key={seg.label}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
            strokeDashoffset={seg.dashOffset}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  )
}
