export interface FAQItem {
  question: string;
  answer: string;
}

// FAQs are now served from i18n JSON files.
// This module is kept for backwards compatibility and API fetch plans.

import type { Locale } from '../i18n/config';
import { t } from '../i18n/utils';

export function getFAQs(locale: Locale = 'en'): FAQItem[] {
  return t(locale, 'faq.items') as FAQItem[];
}
