import type { Locale } from './config';
import { defaultLocale, localeConfig } from './config';
import en from './en.json';
import ar from './ar.json';

const translations: Record<Locale, Record<string, unknown>> = { en, ar };

/**
 * Get a translation value by dot-separated key.
 * Falls back to English if key missing in target locale.
 */
export function t(locale: Locale, key: string): any {
  const value = translations[locale]?.[key] ?? translations[defaultLocale]?.[key] ?? key;
  return value;
}

/** Get dir attribute for a locale */
export function getDir(locale: Locale): 'ltr' | 'rtl' {
  return localeConfig[locale].dir;
}

/** Build a localized path. English has no prefix, Arabic uses /ar/ */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean}`;
}

/** Extract locale from a URL pathname */
export function getLocaleFromUrl(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  if (seg === 'ar') return 'ar';
  return 'en';
}
