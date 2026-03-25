import { getLocales } from 'expo-localization'
import type { Translations } from '@fin-ai/shared'

// t() — for content translations (entity field lookups from translations JSON)
// For UI strings, use: import { useTranslation } from 'react-i18next'

export function t(
  base: string,
  translations: Translations | undefined,
  field: string,
): string {
  const locale = getLocales()[0]?.languageCode ?? 'en'
  if (locale === 'en') return base
  return translations?.[locale]?.[field] || base
}
