export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl'; label: string; switchLabel: string }> = {
  en: { dir: 'ltr', label: 'English', switchLabel: 'العربية' },
  ar: { dir: 'rtl', label: 'العربية', switchLabel: 'English' },
};
