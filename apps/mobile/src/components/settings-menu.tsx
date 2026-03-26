import { Pressable, Text, View } from 'react-native'
import { IconChevronRight } from '@tabler/icons-react-native'
import * as Haptics from 'expo-haptics'
import type { ReactNode } from 'react'

import { useThemeColors } from '@/src/theme/colors'

export function SettingsSectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-xs font-semibold uppercase tracking-wider text-muted">
      {title}
    </Text>
  )
}

export function SettingsMenuCard({
  icon,
  label,
  subtitle,
  onPress,
  showChevron = true,
  destructive,
  dimmed,
}: {
  icon: ReactNode
  label: string
  subtitle?: string
  onPress?: () => void
  showChevron?: boolean
  destructive?: boolean
  dimmed?: boolean
}) {
  const colors = useThemeColors()

  return (
    <Pressable
      className="flex-row items-center bg-card rounded-xl px-4 py-3.5 border border-border active:opacity-70"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPress?.()
      }}
    >
      {icon}

      <View className={`flex-1 ml-3 ${dimmed ? 'opacity-30' : ''}`}>
        <Text className={`text-base font-medium ${destructive ? 'text-red-500' : 'text-text'}`}>
          {label}
        </Text>
        {subtitle ? (
          <Text className="text-xs text-muted mt-0.5">
            {subtitle}
          </Text>
        ) : null}
      </View>

      {showChevron ? (
        <IconChevronRight size={18} color={colors.muted} />
      ) : null}
    </Pressable>
  )
}

export function SettingsSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <View className="mt-6">
      <SettingsSectionTitle title={title} />
      <View className="gap-2 mt-2">{children}</View>
    </View>
  )
}
