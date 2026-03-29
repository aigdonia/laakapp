import { Image, Linking, Platform, useColorScheme, View } from 'react-native'
import { Text } from 'react-native'

const IOS_STORE_URL = 'https://apps.apple.com/app/id_PLACEHOLDER'
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=tech.olanai.finapp'

function getStoreUrl() {
  return Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL
}

export function ForceUpdateScreen() {
  const dark = useColorScheme() === 'dark'

  return (
    <View
      className={`flex-1 items-center justify-center px-8 ${dark ? 'bg-[#1c1c1e]' : 'bg-[#f2f2f7]'}`}
    >
      <Image
        source={require('../../assets/images/icon.png')}
        className="mb-8 h-[120px] w-[120px] rounded-3xl"
      />
      <Text
        className={`mb-3 text-center text-2xl font-bold ${dark ? 'text-white' : 'text-black'}`}
      >
        Update Required
      </Text>
      <Text
        className={`mb-10 text-center text-base leading-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
      >
        A new version of Laak is available with important updates. Please update
        to continue using the app.
      </Text>
      <View
        className="w-full overflow-hidden rounded-2xl bg-[#ffd60a]"
      >
        <Text
          className="px-6 py-4 text-center text-lg font-semibold text-black"
          onPress={() => Linking.openURL(getStoreUrl())}
        >
          Update Now
        </Text>
      </View>
    </View>
  )
}
