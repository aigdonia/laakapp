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

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
] as const

export const SUPPORTED_COUNTRIES = [
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
] as const
