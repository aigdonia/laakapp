import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import { usePreferences } from '@/src/store/preferences'
import { fetchOrCacheTranslations } from '@/src/hooks/use-translations'
import { defaults } from './defaults'
import { resolveLocale, FALLBACK_LNG } from './locale'

const deviceLocale = getLocales()[0]?.languageCode ?? 'en'
const prefs = usePreferences.getState()

i18n.use(initReactI18next).init({
  lng: resolveLocale(prefs.language || deviceLocale, prefs.countryCode || 'EG'),
  fallbackLng: FALLBACK_LNG,
  defaultNS: 'common',
  ns: ['common', 'portfolio', 'insights', 'screening', 'learn', 'settings', 'credits', 'onboarding', 'errors', 'add_holding'],
  resources: {
    en: defaults,
  },
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

/**
 * Load remote translations for a locale and feed into i18next.
 * For country-locales (e.g. ar_EG), loads both the country-locale and the base language.
 */
export async function loadRemoteTranslations(locale: string): Promise<void> {
  const { bundle } = await fetchOrCacheTranslations(locale)
  for (const [ns, keys] of Object.entries(bundle)) {
    i18n.addResourceBundle(locale, ns, keys, true, true)
  }

  // Also load base language if this is a country-locale (e.g. ar_EG → also load ar)
  const underscoreIdx = locale.indexOf('_')
  if (underscoreIdx > 0) {
    const baseLang = locale.substring(0, underscoreIdx)
    const { bundle: baseBundle } = await fetchOrCacheTranslations(baseLang)
    for (const [ns, keys] of Object.entries(baseBundle)) {
      i18n.addResourceBundle(baseLang, ns, keys, true, true)
    }
  }
}

/**
 * Switch app language + country. Updates i18next + persists preference.
 */
export async function changeLanguage(language: string, countryCode: string): Promise<void> {
  const locale = resolveLocale(language, countryCode)
  await loadRemoteTranslations(locale)
  await i18n.changeLanguage(locale)
  usePreferences.getState().setLanguage(language)
  usePreferences.getState().setCountryCode(countryCode)
}
