import { View, type ViewProps } from 'react-native'
import { useTextDirection } from '@/src/hooks/use-text-direction'

type Props = ViewProps & {
  /** Override auto-detected direction */
  force?: 'ltr' | 'rtl'
}

/**
 * A View that sets `direction` style based on the current language.
 * Wrap any zone that should flip layout in RTL languages.
 * Does not affect the global I18nManager — scoped to this subtree only.
 */
export function DirectionalView({ force, style, ...props }: Props) {
  const direction = force ?? useTextDirection()
  return <View style={[{ direction }, style]} {...props} />
}
