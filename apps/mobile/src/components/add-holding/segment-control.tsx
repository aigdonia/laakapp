import { Pressable, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'

type Option = { label: string; value: string; shortLabel?: string }

type Props = {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function SegmentControl({ options, value, onChange }: Props) {
  return (
    <View className="flex-row rounded-xl p-0.5 bg-border">
      {options.map((opt) => {
        const isActive = opt.value === value
        return (
          <Pressable
            key={opt.value}
            className="flex-1 py-2 rounded-lg items-center justify-center"
            style={isActive ? { backgroundColor: '#ffd60a' } : undefined}
            onPress={() => {
              Haptics.selectionAsync()
              onChange(opt.value)
            }}
          >
            <Text
              className={`text-xs text-text ${isActive ? 'font-bold' : 'font-medium'}`}
              style={{ color: isActive ? '#1c1c1e' : undefined }}
              numberOfLines={1}
            >
              {opt.shortLabel ?? opt.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
