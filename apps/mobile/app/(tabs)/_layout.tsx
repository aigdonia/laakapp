import { Tabs, router } from 'expo-router'
import { Platform, Pressable, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTranslation } from 'react-i18next'

import { AppHeader } from '@/src/components/app-header'
import { useThemeColors } from '@/src/theme/colors'
import {
  IconLayoutDashboardFilled,
  IconChartPieFilled,
  IconBookFilled,
  IconSettingsFilled,
  IconPlus,
} from '@tabler/icons-react-native'

export default function TabLayout() {
  const colors = useThemeColors()
  const { t } = useTranslation()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabInactive,
        header: () => <AppHeader />,
        headerStatusBarHeight: 0,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          marginHorizontal: 16,
          borderRadius: 24,
          height: 64,
          paddingBottom: 0,
          borderTopWidth: 0,
          backgroundColor: colors.tabBar,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="portfolio"
        options={{
          title: t('portfolio:title'),
          tabBarIcon: ({ color }) => (
            <IconChartPieFilled size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('insights:title'),
          tabBarIcon: ({ color }) => (
            <IconLayoutDashboardFilled size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: () => (
            <Pressable
              className="flex-1 items-center justify-center"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                router.push('/add-holding')
              }}
            >
              <View className="w-14 h-14 rounded-full bg-accent items-center justify-center shadow-lg shadow-accent/40">
                <IconPlus size={28} color="#1c1c1e" strokeWidth={3} />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('learn:title'),
          tabBarIcon: ({ color }) => (
            <IconBookFilled size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings:title'),
          tabBarIcon: ({ color }) => (
            <IconSettingsFilled size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
