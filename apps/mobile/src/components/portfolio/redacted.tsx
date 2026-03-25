import { View } from 'react-native'
import type { ReactNode } from 'react'

type Props = {
  visible: boolean
  children: ReactNode
}

export function Redacted({ visible, children }: Props) {
  if (visible) return <>{children}</>
  return (
    <View className="justify-center">
      <View style={{ opacity: 0 }}>{children}</View>
      <View
        className="absolute self-stretch rounded-md bg-subtle/30"
        style={{ top: 4, bottom: 4, left: 0, right: 0 }}
      />
    </View>
  )
}
