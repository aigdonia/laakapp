import type { ReactNode } from 'react'
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated'
import { useTabSwipe } from './tab-swipe-context'

/**
 * Wraps tab screen content with a depth-shift animation during swipe.
 * Scales down to 97% and fades to 85% proportional to gesture progress.
 */
export function SwipeAnimatedScreen({ children }: { children: ReactNode }) {
  const { progress } = useTabSwipe()

  const animatedStyle = useAnimatedStyle(() => {
    const absProgress = Math.abs(progress.value)
    return {
      flex: 1,
      transform: [{ scale: interpolate(absProgress, [0, 1], [1, 0.97]) }],
      opacity: interpolate(absProgress, [0, 1], [1, 0.85]),
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  )
}
