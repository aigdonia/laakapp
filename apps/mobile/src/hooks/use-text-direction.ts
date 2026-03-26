import { usePreferences } from '@/src/store/preferences'
import { useLanguages } from '@/src/hooks/use-languages'
import { FALLBACK_LANGUAGES, type TextDirection } from '@/src/i18n/locale'

export function useTextDirection(): TextDirection {
  const language = usePreferences((s) => s.language)
  const { data: languages } = useLanguages()
  const list = languages ?? FALLBACK_LANGUAGES
  const match = list.find((l) => l.code === language)
  return match?.direction ?? 'ltr'
}
