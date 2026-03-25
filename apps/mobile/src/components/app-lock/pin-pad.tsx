import { useCallback } from 'react'
import { Pressable, Text, View } from 'react-native'
import { IconBackspace, IconFingerprint } from '@tabler/icons-react-native'
import * as Haptics from 'expo-haptics'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { useThemeColors } from '@/src/theme/colors'

interface PinPadProps {
  pin: string
  onPinChange: (pin: string) => void
  onComplete: (pin: string) => void
  onBiometric?: () => void
  showBiometric?: boolean
  disabled?: boolean
  error?: boolean
}

const PIN_LENGTH = 4

export function PinPad({
  pin,
  onPinChange,
  onComplete,
  onBiometric,
  showBiometric = false,
  disabled = false,
  error = false,
}: PinPadProps) {
  const colors = useThemeColors()
  const shakeX = useSharedValue(0)

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }))

  // Trigger shake from parent by setting error prop
  if (error) {
    shakeX.value = withSequence(
      withTiming(-12, { duration: 50 }),
      withTiming(12, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    )
  }

  const handlePress = useCallback(
    (digit: string) => {
      if (disabled) return
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      const next = pin + digit
      onPinChange(next)
      if (next.length === PIN_LENGTH) {
        onComplete(next)
      }
    },
    [pin, onPinChange, onComplete, disabled],
  )

  const handleBackspace = useCallback(() => {
    if (disabled || pin.length === 0) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPinChange(pin.slice(0, -1))
  }, [pin, onPinChange, disabled])

  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['biometric', '0', 'backspace'],
  ]

  return (
    <View className="items-center">
      {/* PIN dots */}
      <Animated.View className="flex-row gap-4 mb-10" style={shakeStyle}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            className={`w-4 h-4 rounded-full ${
              i < pin.length ? 'bg-accent' : 'border-2 border-subtle'
            }`}
          />
        ))}
      </Animated.View>

      {/* Keypad */}
      <View className="gap-3">
        {rows.map((row, ri) => (
          <View key={ri} className="flex-row gap-3">
            {row.map((key) => {
              if (key === 'biometric') {
                if (!showBiometric) {
                  return <View key={key} className="w-20 h-16" />
                }
                return (
                  <Pressable
                    key={key}
                    className="w-20 h-16 rounded-2xl bg-card items-center justify-center active:opacity-70"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                      onBiometric?.()
                    }}
                    disabled={disabled}
                  >
                    <IconFingerprint size={28} color={colors.accent} />
                  </Pressable>
                )
              }

              if (key === 'backspace') {
                return (
                  <Pressable
                    key={key}
                    className="w-20 h-16 rounded-2xl items-center justify-center active:opacity-70"
                    onPress={handleBackspace}
                    disabled={disabled}
                  >
                    <IconBackspace size={26} color={colors.muted} />
                  </Pressable>
                )
              }

              return (
                <Pressable
                  key={key}
                  className="w-20 h-16 rounded-2xl bg-card items-center justify-center active:opacity-70"
                  onPress={() => handlePress(key)}
                  disabled={disabled}
                >
                  <Text className="text-2xl font-semibold text-text">{key}</Text>
                </Pressable>
              )
            })}
          </View>
        ))}
      </View>
    </View>
  )
}
