import { Link, Stack } from 'expo-router'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

export default function NotFoundScreen() {
  const { t } = useTranslation('errors')

  return (
    <>
      <Stack.Screen options={{ title: t('oops') }} />
      <View className="flex-1 items-center justify-center p-5 bg-screen">
        <Text className="text-xl font-bold text-text">{t('screen_not_found')}</Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-sm text-blue-500">{t('go_home')}</Text>
        </Link>
      </View>
    </>
  )
}
