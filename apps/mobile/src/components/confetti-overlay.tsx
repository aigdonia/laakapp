import { useEffect, useState, useCallback } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const PARTICLE_COUNT = 40
const COLORS = ['#ffd60a', '#ff3b30', '#34c759', '#007aff', '#ff9500', '#af52de', '#5ac8fa']
const SHAPES = ['square', 'circle', 'strip'] as const

type Particle = {
  id: number
  x: number
  color: string
  shape: typeof SHAPES[number]
  size: number
  rotation: number
  delay: number
}

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_WIDTH,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    delay: Math.random() * 400,
  }))
}

let triggerConfettiFn: (() => void) | null = null

/** Trigger confetti from anywhere */
export function triggerConfetti() {
  triggerConfettiFn?.()
}

export function ConfettiOverlay() {
  const [active, setActive] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  const start = useCallback(() => {
    setParticles(createParticles())
    setActive(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    // Auto-cleanup after animation
    setTimeout(() => setActive(false), 3000)
  }, [])

  useEffect(() => {
    triggerConfettiFn = start
    return () => { triggerConfettiFn = null }
  }, [start])

  if (!active) return null

  return (
    <>
      {particles.map((p) => (
        <ConfettiParticle key={p.id} particle={p} />
      ))}
    </>
  )
}

function ConfettiParticle({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(-40)
  const translateX = useSharedValue(0)
  const rotate = useSharedValue(particle.rotation)
  const opacity = useSharedValue(1)
  const scale = useSharedValue(0)

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 100
    const duration = 2000 + Math.random() * 800

    scale.value = withDelay(
      particle.delay,
      withTiming(1, { duration: 150 }),
    )
    translateY.value = withDelay(
      particle.delay,
      withTiming(SCREEN_HEIGHT + 40, {
        duration,
        easing: Easing.in(Easing.quad),
      }),
    )
    translateX.value = withDelay(
      particle.delay,
      withTiming(drift, {
        duration,
        easing: Easing.out(Easing.sin),
      }),
    )
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation + 360 + Math.random() * 360, {
        duration,
      }),
    )
    opacity.value = withDelay(
      particle.delay + duration * 0.7,
      withTiming(0, { duration: duration * 0.3 }),
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }))

  const shapeStyle = particle.shape === 'circle'
    ? { borderRadius: particle.size / 2, width: particle.size, height: particle.size }
    : particle.shape === 'strip'
      ? { width: particle.size * 0.4, height: particle.size * 1.8, borderRadius: 2 }
      : { width: particle.size, height: particle.size, borderRadius: 2 }

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: particle.x,
          top: -20,
          backgroundColor: particle.color,
          zIndex: 10000,
          ...shapeStyle,
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    />
  )
}
