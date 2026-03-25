import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react-native'

import { useThemeColors } from '@/src/theme/colors'

type Props = {
  text: string
  detail?: string
}

export function InsightBullet({ text, detail }: Props) {
  const colors = useThemeColors()
  const [expanded, setExpanded] = useState(false)

  if (!detail) {
    return (
      <View className="flex-row items-start gap-2 py-1.5">
        <Text className="text-muted mt-0.5">•</Text>
        <Text className="text-sm text-text flex-1">{text}</Text>
      </View>
    )
  }

  return (
    <Pressable
      className="py-1.5 active:opacity-70"
      onPress={() => setExpanded(!expanded)}
    >
      <View className="flex-row items-start gap-2">
        {expanded ? (
          <IconChevronDown size={14} color={colors.muted} style={{ marginTop: 3 }} />
        ) : (
          <IconChevronRight size={14} color={colors.muted} style={{ marginTop: 3 }} />
        )}
        <Text className="text-sm text-text flex-1">{text}</Text>
      </View>
      {expanded && (
        <Text className="text-xs text-muted ml-5 mt-1">{detail}</Text>
      )}
    </Pressable>
  )
}
