import { useColorScheme } from 'react-native'

export const accent = '#ffd60a'

export const status = {
  compliant: '#34c759',
  review: '#ff9500',
  negative: '#ff3b30',
} as const

const palette = {
  light: {
    screen: '#f2f2f7',
    card: '#ffffff',
    text: '#1c1c1e',
    muted: '#636366',
    subtle: '#aeaeb2',
    input: '#f2f2f7',
    border: '#e5e5ea',
    accent: '#d4a017',
    tabBar: 'rgba(255, 255, 255, 0.85)',
    tabInactive: '#8e8e93',
  },
  dark: {
    screen: '#1c1c1e',
    card: '#2c2c2e',
    text: '#ffffff',
    muted: '#aeaeb2',
    subtle: '#636366',
    input: '#2c2c2e',
    border: '#3a3a3c',
    accent,
    tabBar: 'rgba(44, 44, 46, 0.85)',
    tabInactive: '#636366',
  },
} as const

export function useThemeColors() {
  const scheme = useColorScheme() ?? 'light'
  return palette[scheme]
}
