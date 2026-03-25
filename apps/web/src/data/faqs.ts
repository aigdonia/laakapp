export interface FAQItem {
  question: string;
  answer: string;
}

// Hardcoded fallback FAQs — will be replaced by API fetch at build time
export const fallbackFAQs: FAQItem[] = [
  {
    question: 'Is Laak a financial advisor?',
    answer:
      'No. Laak is a calculator, translator, and reporter. It shows you data from trusted sources and helps you understand your portfolio — it never tells you what to buy or sell.',
  },
  {
    question: 'How does compliance screening work?',
    answer:
      'Laak aggregates screening data from recognized sources like AAOIFI standards and established screening providers. It presents compliance status clearly, with explanations — but the final judgment is always yours. Screening is an optional feature you can enable based on your investment criteria.',
  },
  {
    question: 'Where is my data stored?',
    answer:
      'On your device. Laak is offline-first by design. Your portfolio data never leaves your phone unless you explicitly choose to sync it (encrypted, to your own cloud backup).',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No email, no password, no personal info required. Just open the app and start tracking. Biometric lock keeps your data secure.',
  },
  {
    question: 'Which markets does Laak support?',
    answer:
      'We\'re starting with the Egyptian Exchange (EGX), expanding to Saudi (Tadawul) and GCC markets, then Malaysia and Southeast Asia. About 620 stocks total across these markets.',
  },
  {
    question: 'Does it work without internet?',
    answer:
      'Yes. Laak is designed for unreliable connectivity. You can view your portfolio, check screening status, and explore your data fully offline. Market prices update when you\'re back online.',
  },
  {
    question: 'Is Laak free?',
    answer:
      'The core experience — portfolio tracking, basic screening, and offline access — is free. Premium features like AI-powered analysis, advanced screening details, and multi-market support will be available through a subscription.',
  },
];

export async function getFAQs(): Promise<FAQItem[]> {
  // TODO: Fetch from API at build time when endpoint exists
  // const apiUrl = import.meta.env.FAQ_API_URL;
  // if (apiUrl) {
  //   try {
  //     const res = await fetch(`${apiUrl}/articles?category=faq`);
  //     if (res.ok) return await res.json();
  //   } catch (e) {
  //     console.warn('FAQ fetch failed, using fallback:', e);
  //   }
  // }
  return fallbackFAQs;
}
