# App Store Reviewer Notes

Copy this text into App Store Connect > App Review Information > Notes.

---

## Authentication

Laak uses anonymous authentication (Supabase). No login is required to use the app — all features are accessible immediately upon first launch. Users may optionally sign in with Apple to enable cloud backup of their portfolio data.

No demo account is needed. Simply launch the app to access all functionality.

## AI-Powered Features

This app uses the Google Gemini API to generate financial analysis content, including:

- **AI Portfolio Narrative**: Generates a plain-language summary of the user's portfolio performance.
- **AI Stock Analysis**: Provides financial analysis of individual stocks (fundamentals, sector context, compliance status).
- **Return Simulator / DCA Calculator**: AI-assisted financial projection tools.

All AI-generated content is clearly labeled as "AI-generated" in the UI. The app provides financial information and analysis only — it never provides investment advice or recommendations. AI output is gated behind a credit system (in-app purchase) to prevent abuse.

AI-generated content is not shared between users. There is no user-generated content or social features, so report/block mechanisms are not applicable.

## In-App Purchases

The app uses RevenueCat to manage credit packages (consumable IAP). Credits are used to access AI-powered analysis features. A "Restore Purchases" button is available in Settings > Credits.

## Privacy

- All portfolio and financial data is stored on-device only (SQLite). No user financial data is transmitted to or stored on our servers.
- Anonymous analytics via PostHog, with App Tracking Transparency (ATT) consent prompt shown before any tracking.
- Cloud backup (optional, requires Apple Sign-In) stores an encrypted copy of portfolio transactions on Cloudflare R2 — accessible only to the authenticated user.
- Account deletion is available in Settings > Data & Privacy > Delete Account.

## Support

- Support URL: https://laak.olanai.tech/support
- Privacy Policy: https://laak.olanai.tech/privacy
- Contact: laak@olanai.tech
