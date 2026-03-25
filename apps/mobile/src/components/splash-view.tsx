import { useEffect } from 'react'
import { Image, StyleSheet, useColorScheme, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  progress: number
}

export function SplashView({ progress }: Props) {
  const dark = useColorScheme() === 'dark'
  const animatedProgress = useSharedValue(0)

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    })
  }, [progress, animatedProgress])

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }))

  return (
    <View style={[styles.container, dark ? styles.containerDark : styles.containerLight]}>
      <Image
        source={require('../../assets/images/icon.png')}
        style={styles.icon}
      />
      <View style={[styles.track, dark ? styles.trackDark : styles.trackLight]}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLight: {
    backgroundColor: '#f2f2f7',
  },
  containerDark: {
    backgroundColor: '#1c1c1e',
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: 32,
  },
  track: {
    width: 200,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackLight: {
    backgroundColor: '#e5e5ea',
  },
  trackDark: {
    backgroundColor: '#3a3a3c',
  },
  bar: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#ffd60a',
  },
})
