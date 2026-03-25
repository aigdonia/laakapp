import { Pressable, Text, View } from 'react-native'
import { IconBook, IconX } from '@tabler/icons-react-native'
import { useTranslation } from 'react-i18next'

import { useThemeColors } from '@/src/theme/colors'
import type { LearningNudge } from '@/src/types/insights'

type Props = {
  nudge: LearningNudge
  onDismiss: () => void
  onPress: () => void
}

export function LearningNudgeCard({ nudge, onDismiss, onPress }: Props) {
  const colors = useThemeColors()
  const { t } = useTranslation('insights')

  return (
    <Pressable
      className="bg-accent/10 rounded-2xl mx-4 p-4 active:opacity-70"
      onPress={onPress}
    >
      <View className="flex-row items-start gap-3">
        <View className="bg-accent/20 rounded-xl p-2 mt-0.5">
          <IconBook size={18} color={colors.accent} />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-semibold text-text">{t(nudge.titleKey)}</Text>
          <Text className="text-xs text-muted mt-1">{t(nudge.descriptionKey)}</Text>
        </View>

        <Pressable
          className="p-1 active:opacity-50"
          onPress={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          hitSlop={8}
        >
          <IconX size={16} color={colors.subtle} />
        </Pressable>
      </View>
    </Pressable>
  )
}
