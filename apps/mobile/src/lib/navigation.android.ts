import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export const modalPresentation: NativeStackNavigationOptions = {
  presentation: 'modal',
  headerShown: false,
  animation: 'slide_from_bottom',
  contentStyle: { paddingTop: 32, paddingBottom: 32 },
}
