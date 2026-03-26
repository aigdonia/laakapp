/**
 * Locale resolution: combines language + country into a specific locale,
 * with a fallback chain for progressively less specific matches.
 */

export function resolveLocale(language: string, countryCode: string): string {
  // English doesn't need a country suffix
  if (language === 'en') return 'en'
  return `${language}_${countryCode}`
}

export const FALLBACK_LNG: Record<string, string[]> = {
  ar_EG: ['ar', 'en'],
  ar_SA: ['ar', 'en'],
  ms_MY: ['ms', 'en'],
  ar: ['en'],
  ms: ['en'],
  default: ['en'],
}

export type TextDirection = 'ltr' | 'rtl'

/** Hardcoded offline fallback — used when API + cache are both empty. */
export const FALLBACK_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' as TextDirection, enabled: true, id: 'en', createdAt: '', updatedAt: '' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' as TextDirection, enabled: true, id: 'ar', createdAt: '', updatedAt: '' },
]

export const SUPPORTED_COUNTRIES = [
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
] as const
