-- Seed: Languages
INSERT OR IGNORE INTO languages (id, name, code, native_name, direction, enabled)
VALUES
  ('lang-en', 'English', 'en', 'English', 'ltr', 1),
  ('lang-ar', 'Arabic', 'ar', 'العربية', 'rtl', 1),
  ('lang-ms', 'Malay', 'ms', 'Bahasa Melayu', 'ltr', 1);

-- Seed: Countries
INSERT OR IGNORE INTO countries (id, name, code, currency, flag_emoji, enabled)
VALUES
  ('country-eg', 'Egypt', 'EG', 'EGP', '🇪🇬', 1),
  ('country-sa', 'Saudi Arabia', 'SA', 'SAR', '🇸🇦', 1),
  ('country-my', 'Malaysia', 'MY', 'MYR', '🇲🇾', 1);

-- Seed: Asset Classes
-- Slugs match mobile AssetType values: stock, etf, crypto, gold, cash, sukuk, real_estate, other
INSERT OR IGNORE INTO asset_classes (id, name, slug, icon, "order", enabled, fields, aggregation_keys)
VALUES
  ('ac-stocks', 'Stocks', 'stock', 'chart-line', 1, 1,
   '[{"key":"symbol","label":"Symbol","type":"stock","placeholder":"e.g. AAPL"},{"key":"name","label":"Name","type":"text","placeholder":"e.g. Apple Inc.","required":true},{"key":"exchange","label":"Exchange","type":"text","placeholder":"e.g. EGX"},{"key":"quantity","label":"Shares","type":"number","placeholder":"0","required":true},{"key":"costPerUnit","label":"Avg. Cost / Share","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"fees","label":"Fees","type":"number","placeholder":"0.00","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]',
   '["symbol","exchange"]'),
  ('ac-etfs', 'ETFs', 'etf', 'chart-pie', 2, 1,
   '[{"key":"symbol","label":"Symbol","type":"etf","placeholder":"e.g. VOO"},{"key":"name","label":"Name","type":"text","placeholder":"e.g. Vanguard S&P 500","required":true},{"key":"exchange","label":"Exchange","type":"text","placeholder":"e.g. NYSE"},{"key":"quantity","label":"Units","type":"number","placeholder":"0","required":true},{"key":"costPerUnit","label":"Avg. Cost / Unit","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"fees","label":"Fees","type":"number","placeholder":"0.00","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]',
   '["symbol","exchange"]'),
  ('ac-sukuk', 'Sukuk', 'sukuk', 'certificate', 3, 1,
   '[{"key":"name","label":"Name","type":"text","placeholder":"e.g. Sukuk Al-Ijara","required":true},{"key":"quantity","label":"Face Value","type":"number","placeholder":"0.00","required":true},{"key":"profitRate","label":"Profit Rate (%)","type":"number","placeholder":"0.00"},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"maturityDate","label":"Maturity Date","type":"date","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]',
   '["name","maturityDate"]'),
  ('ac-crypto', 'Crypto', 'crypto', 'currency-bitcoin', 4, 1,
   '[{"key":"symbol","label":"Symbol","type":"text","placeholder":"e.g. BTC"},{"key":"name","label":"Name","type":"text","placeholder":"e.g. Bitcoin","required":true},{"key":"quantity","label":"Amount","type":"number","placeholder":"0.00000000","required":true},{"key":"costPerUnit","label":"Avg. Cost / Unit","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]',
   '["symbol"]'),
  ('ac-gold', 'Gold', 'gold', 'coins', 5, 1,
   '[{"key":"quantity","label":"Weight","type":"number","placeholder":"0.00","required":true},{"key":"unit","label":"Unit","type":"segment","options":[{"label":"Gram","value":"g"},{"label":"Ounce","value":"oz"},{"label":"Tola","value":"tola"}]},{"key":"purity","label":"Purity","type":"segment","options":[{"label":"24K","value":"24K"},{"label":"22K","value":"22K"},{"label":"21K","value":"21K"},{"label":"18K","value":"18K"}]},{"key":"costPerUnit","label":"Cost / Unit","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]',
   '["purity","unit"]'),
  ('ac-cash', 'Cash', 'cash', 'cash', 6, 1,
   '[{"key":"quantity","label":"Amount","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]',
   '["currency"]'),
  ('ac-real-estate', 'Real Estate', 'real_estate', 'building', 7, 1,
   '[{"key":"name","label":"Property Name","type":"text","placeholder":"e.g. Apartment Downtown","required":true},{"key":"estimatedValue","label":"Estimated Value","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"costPerUnit","label":"Purchase Price","type":"number","placeholder":"0.00","advanced":true},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]',
   '["name"]'),
  ('ac-other', 'Other', 'other', 'dots', 8, 1,
   '[{"key":"name","label":"Name","type":"text","placeholder":"e.g. Private equity","required":true},{"key":"quantity","label":"Quantity","type":"number","placeholder":"0","required":true},{"key":"costPerUnit","label":"Cost / Unit","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]',
   '["name"]');

-- Fix slugs for existing databases (INSERT OR IGNORE skips existing rows)
UPDATE asset_classes SET slug = 'stock' WHERE id = 'ac-stocks' AND slug = 'stocks';
UPDATE asset_classes SET slug = 'etf' WHERE id = 'ac-etfs' AND slug = 'etfs';
UPDATE asset_classes SET slug = 'real_estate' WHERE id = 'ac-real-estate' AND slug = 'real-estate';

-- Populate fields for existing rows (INSERT OR IGNORE skips them, so fields would be '[]')
UPDATE asset_classes SET fields = '[{"key":"symbol","label":"Symbol","type":"stock","placeholder":"e.g. AAPL"},{"key":"name","label":"Name","type":"text","placeholder":"e.g. Apple Inc.","required":true},{"key":"exchange","label":"Exchange","type":"text","placeholder":"e.g. EGX"},{"key":"quantity","label":"Shares","type":"number","placeholder":"0","required":true},{"key":"costPerUnit","label":"Avg. Cost / Share","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"fees","label":"Fees","type":"number","placeholder":"0.00","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]' WHERE id = 'ac-stocks' AND fields = '[]';
UPDATE asset_classes SET fields = '[{"key":"symbol","label":"Symbol","type":"etf","placeholder":"e.g. VOO"},{"key":"name","label":"Name","type":"text","placeholder":"e.g. Vanguard S&P 500","required":true},{"key":"exchange","label":"Exchange","type":"text","placeholder":"e.g. NYSE"},{"key":"quantity","label":"Units","type":"number","placeholder":"0","required":true},{"key":"costPerUnit","label":"Avg. Cost / Unit","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"fees","label":"Fees","type":"number","placeholder":"0.00","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]' WHERE id = 'ac-etfs' AND fields = '[]';
UPDATE asset_classes SET fields = '[{"key":"name","label":"Name","type":"text","placeholder":"e.g. Sukuk Al-Ijara","required":true},{"key":"quantity","label":"Face Value","type":"number","placeholder":"0.00","required":true},{"key":"profitRate","label":"Profit Rate (%)","type":"number","placeholder":"0.00"},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"maturityDate","label":"Maturity Date","type":"date","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]' WHERE id = 'ac-sukuk' AND fields = '[]';
UPDATE asset_classes SET fields = '[{"key":"symbol","label":"Symbol","type":"text","placeholder":"e.g. BTC"},{"key":"name","label":"Name","type":"text","placeholder":"e.g. Bitcoin","required":true},{"key":"quantity","label":"Amount","type":"number","placeholder":"0.00000000","required":true},{"key":"costPerUnit","label":"Avg. Cost / Unit","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]' WHERE id = 'ac-crypto' AND fields = '[]';
UPDATE asset_classes SET fields = '[{"key":"quantity","label":"Weight","type":"number","placeholder":"0.00","required":true},{"key":"unit","label":"Unit","type":"segment","options":[{"label":"Gram","value":"g"},{"label":"Ounce","value":"oz"},{"label":"Tola","value":"tola"}]},{"key":"purity","label":"Purity","type":"segment","options":[{"label":"24K","value":"24K"},{"label":"22K","value":"22K"},{"label":"21K","value":"21K"},{"label":"18K","value":"18K"}]},{"key":"costPerUnit","label":"Cost / Unit","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]' WHERE id = 'ac-gold' AND fields = '[]';
UPDATE asset_classes SET fields = '[{"key":"quantity","label":"Amount","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]' WHERE id = 'ac-cash' AND fields = '[]';
UPDATE asset_classes SET fields = '[{"key":"name","label":"Property Name","type":"text","placeholder":"e.g. Apartment Downtown","required":true},{"key":"estimatedValue","label":"Estimated Value","type":"number","placeholder":"0.00","required":true},{"key":"currency","label":"Currency","type":"segment","options":[{"label":"EGP","value":"EGP"},{"label":"USD","value":"USD"},{"label":"SAR","value":"SAR"},{"label":"AED","value":"AED"},{"label":"EUR","value":"EUR"},{"label":"GBP","value":"GBP"},{"label":"MYR","value":"MYR"}]},{"key":"costPerUnit","label":"Purchase Price","type":"number","placeholder":"0.00","advanced":true},{"key":"date","label":"Purchase Date","type":"date","advanced":true},{"key":"notes","label":"Notes","type":"text","placeholder":"Optional notes...","advanced":true}]' WHERE id = 'ac-real-estate' AND fields = '[]';

-- Fix symbol field type: text → stock/etf (enables searchable picker in mobile app)
UPDATE asset_classes SET fields = json_replace(fields, '$[0].type', 'stock')
  WHERE id = 'ac-stocks' AND json_extract(fields, '$[0].key') = 'symbol' AND json_extract(fields, '$[0].type') = 'text';
UPDATE asset_classes SET fields = json_replace(fields, '$[0].type', 'etf')
  WHERE id = 'ac-etfs' AND json_extract(fields, '$[0].key') = 'symbol' AND json_extract(fields, '$[0].type') = 'text';

-- Populate aggregation_keys for existing rows
UPDATE asset_classes SET aggregation_keys = '["symbol","exchange"]' WHERE id = 'ac-stocks' AND aggregation_keys = '[]';
UPDATE asset_classes SET aggregation_keys = '["symbol","exchange"]' WHERE id = 'ac-etfs' AND aggregation_keys = '[]';
UPDATE asset_classes SET aggregation_keys = '["name","maturityDate"]' WHERE id = 'ac-sukuk' AND aggregation_keys = '[]';
UPDATE asset_classes SET aggregation_keys = '["symbol"]' WHERE id = 'ac-crypto' AND aggregation_keys = '[]';
UPDATE asset_classes SET aggregation_keys = '["purity","unit"]' WHERE id = 'ac-gold' AND aggregation_keys = '[]';
UPDATE asset_classes SET aggregation_keys = '["currency"]' WHERE id = 'ac-cash' AND aggregation_keys = '[]';
UPDATE asset_classes SET aggregation_keys = '["name"]' WHERE id = 'ac-real-estate' AND aggregation_keys = '[]';
UPDATE asset_classes SET aggregation_keys = '["name"]' WHERE id IN ('ac-other') AND aggregation_keys = '[]';

-- Seed: Screening Rules
-- Unified threshold keys: debt, cash_and_interest_bearing, receivables, non_permissible_income, interest_bearing_deposits
-- Denominator noted in description, not in key names
INSERT OR REPLACE INTO screening_rules (id, name, slug, methodology, description, thresholds, enabled)
VALUES
  ('sr-aaoifi', 'AAOIFI (Standard 21)', 'aaoifi-standard', 'AAOIFI',
   'Strictest major standard. Ratios measured against market capitalization.',
   '{"debt":30,"interest_bearing_deposits":30,"non_permissible_income":5}',
   1),
  ('sr-djim', 'Dow Jones Islamic Market', 'dow-jones-islamic-market', 'DJIM',
   'Ratios measured against trailing 24-month average market capitalization.',
   '{"debt":33,"cash_and_interest_bearing":33,"receivables":33,"non_permissible_income":5}',
   1),
  ('sr-sp', 'S&P Shariah', 'sp-shariah', 'S&P',
   'Ratios measured against 36-month average market value of equity.',
   '{"debt":33,"cash_and_interest_bearing":33,"receivables":49,"non_permissible_income":5}',
   1),
  ('sr-msci', 'MSCI Islamic', 'msci-islamic', 'MSCI',
   'Ratios measured against total assets.',
   '{"debt":33.33,"cash_and_interest_bearing":33.33,"receivables":33.33,"non_permissible_income":5}',
   1),
  ('sr-ftse', 'FTSE Shariah (Yasaar)', 'ftse-shariah', 'FTSE',
   'Ratios measured against total assets.',
   '{"debt":33.33,"cash_and_interest_bearing":33.33,"receivables":50,"non_permissible_income":5}',
   1);

-- Seed: App Settings (singleton)
INSERT OR IGNORE INTO app_settings (id, maintenance_mode, default_language, onboarding_enabled)
VALUES ('settings-default', 0, 'en', 1);

-- Seed: Article Categories
INSERT OR IGNORE INTO article_categories (id, title, slug, icon, "order", enabled, translations)
VALUES
  ('cat-basics', 'Getting Started', 'getting-started', '🚀', 1, 1, '{"ar":{"title":"البداية"}}'),
  ('cat-support', 'Support', 'support', '💬', 2, 1, '{"ar":{"title":"الدعم"}}'),
  ('cat-legal', 'Legal', 'legal', '📜', 99, 1, '{"ar":{"title":"قانوني"}}');

-- Seed: Articles
INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES
  ('art-1', 'A Beginner''s Guide to Halal Investing', 'beginners-guide',
   'Everything you need to know to start your halal investment journey — from screening basics to building your first portfolio.',
   'Starting your halal investing journey can feel overwhelming. There are screening criteria to learn, unfamiliar terms, and conflicting opinions. This guide breaks it all down into simple steps.

## Step 1: Understand Screening
Sharia screening filters companies based on their business activities and financial ratios. The two main things to check are:
- **Business activity**: Does the company earn money from halal sources?
- **Financial ratios**: Are debt and interest income below acceptable thresholds?

## Step 2: Choose Your Authority
Different scholars and organizations have slightly different screening criteria. AAOIFI is widely accepted globally. Choose one authority and stick with it for consistency.

## Step 3: Start Small
You don''t need a large sum to begin. Many markets allow you to buy fractional shares. Start with 2-3 well-screened companies you understand.',
   'en', 'published', '2025-03-01', 'cat-basics'),

  ('art-2', 'Understanding Islamic Finance Ratios', 'islamic-finance-ratios',
   'The three key financial ratios every Muslim investor should know — debt, cash, and revenue screening explained simply.',
   'Islamic finance screening uses three main financial ratios to determine if a stock is permissible to invest in.

## 1. Debt Ratio
Total interest-bearing debt / Market capitalization must be below 30% (AAOIFI standard). This ensures the company isn''t overly reliant on interest-based financing.

## 2. Cash & Interest-Bearing Securities
Cash and interest-bearing investments / Market capitalization should be below 30%. Companies sitting on large cash reserves in interest-bearing accounts raise concerns.

## 3. Impermissible Revenue
Revenue from non-permissible activities / Total revenue must be below 5%. This covers things like alcohol sales, gambling, or conventional financial services.',
   'en', 'published', '2025-03-10', 'cat-basics'),

  ('art-3', 'Zakat Calculator: Stocks & Investments', 'zakat-stocks',
   'How to calculate Zakat on your stock portfolio — with worked examples for different holding strategies.',
   'Calculating Zakat on stocks depends on your intention: are you an investor or a trader?

## For Long-Term Investors
If you buy and hold stocks for their dividends and long-term growth, Zakat is due on your share of the company''s Zakatable assets (cash, receivables, inventory). Many scholars simplify this to 2.5% of the current market value.

## For Active Traders
If you frequently buy and sell stocks, they are treated as trading goods. Zakat is 2.5% of the total market value of your portfolio on your Zakat date.

## Example
You hold EGP 100,000 in stocks for investment. Your simplified Zakat would be: 100,000 × 2.5% = EGP 2,500.',
   'en', 'published', '2025-03-15', 'cat-basics'),

  ('art-4', 'The EGX: A Halal Investor''s Overview', 'egx-halal-overview',
   'A practical look at the Egyptian Exchange through a Sharia lens — which sectors pass screening and common pitfalls.',
   'The Egyptian Exchange (EGX) lists around 220 companies across diverse sectors. For halal investors, here''s what you need to know.

## Generally Compliant Sectors
- **Real Estate & Construction**: Many pass screening, but check for conventional mortgage exposure
- **Food & Agriculture**: Usually straightforward halal businesses
- **Healthcare**: Generally permissible, check for insurance subsidiaries

## Sectors Requiring Careful Screening
- **Banking**: Conventional banks are not permissible. Look for Islamic banking alternatives.
- **Tourism & Entertainment**: Mixed — hotels with alcohol revenue may fail the 5% threshold

## Tips for EGX Investors
1. Screen every stock individually — sector alone doesn''t guarantee compliance
2. Re-screen quarterly as financial ratios change
3. Keep records for Zakat and purification calculations',
   'en', 'published', '2025-03-20', 'cat-basics'),

  ('art-terms', 'Terms of Service', 'terms-of-service',
   'Terms of Service for Laak — the private investment portfolio tracker. Please read these terms carefully before using the application.',
   'By downloading, installing, or using Laak ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the App.

## 1. About Laak

Laak is a personal portfolio visualization and tracking tool. The App allows you to manually record your investments, view portfolio analytics, access educational content, and receive AI-generated summaries of your holdings.

**Laak is a visualization, tracking, and reporting tool — not a financial advisor, regulatory authority, or trading platform.**

## 2. Eligibility

You must be at least 18 years old (or the age of majority in your jurisdiction) to use the App. By using Laak, you represent that you meet this requirement.

## 3. Account & Identity

- **Anonymous by default.** When you first open Laak, a random identifier (UUID) is created on your device. No name, email, phone number, or personal information is required.
- **Optional sign-in.** You may choose to sign in with Apple or Google to enable cloud backup. If you do, your authentication provider shares only the minimum information needed (typically an email address or opaque identifier).
- **You are responsible** for maintaining the security of your device and any sign-in credentials associated with your account.

## 4. Your Data & Privacy

### 4.1 On-Device Storage
All portfolio data — your holdings, transactions, preferences, and notes — is stored locally on your device in an encrypted database. Laak does not transmit this data to any server unless you explicitly enable cloud backup.

### 4.2 What We Do Not Collect
- We do not collect your name, phone number, or physical address
- We use anonymous, aggregated usage analytics — no personal data is collected or sent
- We do not use tracking pixels or advertising identifiers
- We do not sell, rent, or share your data with third parties for advertising
- We do not access your brokerage accounts, bank accounts, or financial institutions

### 4.3 Cloud Backup (Optional)
If you enable cloud backup, your portfolio database is encrypted and stored on secure cloud infrastructure (Cloudflare R2). Only you can access your backup through your signed-in account. You can delete your backup at any time.

### 4.4 Cached Content
The App downloads and caches educational articles, market metadata (stock names, exchange codes, sector classifications), screening rules, and translation bundles from our servers. This cached content contains no personal data and can be cleared at any time from Settings.

### 4.5 Data Deletion
You can delete all your data at any time using the "Reset All Data" option in Settings. This permanently removes your local portfolio database. If you have cloud backup enabled, you may also request deletion of your cloud backup.

## 5. AI-Powered Features

### 5.1 How AI Works in Laak
Laak offers optional AI-generated portfolio narratives. When you request an AI summary, a snapshot of your portfolio composition (asset types, allocation percentages, and values) is sent to our AI provider (Anthropic Claude) for processing.

### 5.2 What Is Sent
- Asset breakdown by type and approximate value
- No personally identifying information (no name, email, or account numbers)
- A unique digital fingerprint (hash) to detect duplicate requests

### 5.3 What Is Not Sent
- Your full transaction history
- Your device information or location
- Any data from other apps on your device

### 5.4 AI Limitations
- AI-generated content is **informational only** and does not constitute financial advice, investment recommendation, or compliance ruling
- AI outputs may contain inaccuracies, outdated information, or incomplete analysis
- You should independently verify any information provided by AI features
- AI features require credits (see Section 7)

## 6. Compliance Screening Information

### 6.1 Informational Purpose Only
Laak offers optional compliance screening based on published methodologies (such as AAOIFI standards for Sharia compliance). These results are **informational tools** — they are not rulings, certifications, or endorsements.

### 6.2 No Guarantee of Accuracy
- Screening data is based on publicly available financial reports and may be delayed, incomplete, or outdated
- Financial ratios change quarterly; a stock that passes screening today may fail tomorrow
- Different screening bodies and methodologies may reach different conclusions about the same security

### 6.3 Consult Qualified Professionals
For definitive guidance on investment compliance, consult a qualified professional or your relevant advisory board. Laak provides data to inform your decisions — it does not make decisions for you.

## 7. Credits & In-App Purchases

### 7.1 Credit System
Certain premium features (such as AI narrative generation) require credits. Credits are purchased through Apple App Store or Google Play Store in-app purchases.

### 7.2 Pricing
- Credit packages are priced in your local currency as determined by the App Store
- Prices may vary by region and are subject to change
- All prices include applicable taxes as determined by your App Store

### 7.3 Credits Do Not Expire
Once purchased, your credits remain available indefinitely and do not expire.

### 7.4 Refunds
All purchases are processed through Apple or Google. Refund requests must be submitted directly to Apple App Store or Google Play Store in accordance with their respective refund policies. Laak does not process payments or refunds directly.

### 7.5 Payment Model
Currently, Laak uses a prepaid credit system with no recurring charges. We may introduce subscription options in the future — in which case you will be clearly notified before any change, and no automatic charges will apply.

## 8. Affiliate Links & Third-Party Services

### 8.1 Contextual Recommendations
Laak may display links to third-party investment platforms, brokerages, gold dealers, or financial services. These links are contextual — shown when relevant to your portfolio composition (e.g., a link to a gold platform when viewing gold-related content).

### 8.2 Affiliate Compensation
Laak may earn a commission if you sign up for a third-party service through these links. This does not affect the price you pay and does not influence the content or screening results shown in the App.

### 8.3 Third-Party Terms
When you follow an affiliate link and use a third-party service, you are subject to that service''s own terms, privacy policy, and regulatory framework. Laak is not responsible for the products, services, or actions of third-party platforms.

### 8.4 Not Endorsements
The inclusion of any third-party link does not constitute an endorsement, recommendation, or guarantee by Laak. You should conduct your own due diligence before using any third-party financial service.

## 9. Educational Content

### 9.1 For Informational Purposes
All articles, guides, lessons, and educational materials in Laak are provided for general informational and educational purposes only. They do not constitute financial advice, investment recommendations, tax advice, or compliance rulings.

### 9.2 No Professional Relationship
Reading educational content in Laak does not create a fiduciary, advisory, or professional relationship between you and Laak or its content creators.

### 9.3 Content Accuracy
While we strive for accuracy, educational content may contain errors, become outdated, or not apply to your specific situation. Always verify information independently and consult qualified professionals for advice specific to your circumstances.

## 10. Market Data

### 10.1 Data Sources
Laak displays market data including stock prices, exchange rates, and asset valuations. This data is sourced from third-party providers and may be delayed.

### 10.2 No Real-Time Guarantee
- Market data may be delayed by minutes, hours, or days depending on your connectivity and cache state
- Laak is designed to work offline; cached prices may not reflect current market conditions
- The App displays a data freshness indicator to help you understand when data was last updated

### 10.3 Not for Trading Decisions
Market data in Laak is for portfolio tracking and visualization. It should not be used as the sole basis for trading or investment decisions. Always verify current prices through your brokerage before executing trades.

## 11. Offline-First Design

### 11.1 How It Works
Laak is designed to function without an internet connection. Your portfolio data is always accessible regardless of connectivity. Market data, articles, and other content are cached locally for offline access.

### 11.2 Data Freshness
When offline, the App uses the most recently cached data. Prices, screening results, and content may be outdated. The App will update automatically when connectivity is restored.

## 12. Intellectual Property

### 12.1 App Ownership
Laak, including its design, code, content, branding, and visual identity, is the intellectual property of Olan ("the Company"). All rights are reserved.

### 12.2 Your Content
You retain ownership of all data you enter into Laak (your holdings, transactions, notes). We claim no ownership over your portfolio data.

### 12.3 License to Use
We grant you a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes in accordance with these Terms.

## 13. Prohibited Uses

You agree not to:
- Use the App for commercial financial advisory services
- Reverse-engineer, decompile, or disassemble the App
- Attempt to access other users'' data or our server infrastructure
- Use the App to facilitate money laundering, fraud, or any illegal activity
- Redistribute, resell, or sublicense the App or its content
- Use automated systems (bots, scrapers) to access the App or its API
- Misrepresent AI-generated content as professional financial advice

## 14. Disclaimers

### 14.1 No Financial Advice
**Laak does not provide financial advice, investment recommendations, or compliance rulings.** The App is a visualization and tracking tool. All investment decisions are yours alone.

### 14.2 No Warranty
The App is provided "as is" and "as available" without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement.

### 14.3 Accuracy of Calculations
While we strive for accuracy in portfolio calculations, Zakat estimates, and screening results, we do not guarantee that all calculations are error-free. You should verify important calculations independently.

### 14.4 Investment Risk
All investments carry risk, including the potential loss of principal. Past performance does not guarantee future results. Laak displays your portfolio data — it does not predict or guarantee investment outcomes.

## 15. Limitation of Liability

To the maximum extent permitted by applicable law:
- Laak and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages
- Our total liability for any claim arising from your use of the App shall not exceed the amount you paid for credits in the 12 months preceding the claim
- We are not liable for investment losses, missed opportunities, or financial decisions made using information displayed in the App

## 16. Indemnification

You agree to indemnify and hold harmless Laak, its operators, affiliates, and employees from any claims, damages, or expenses arising from your use of the App, your violation of these Terms, or your violation of any applicable law.

## 17. Modifications to the App & Terms

### 17.1 App Changes
We may update, modify, or discontinue features of the App at any time. We will make reasonable efforts to preserve your data through updates.

### 17.2 Terms Changes
We may update these Terms from time to time. Material changes will be communicated through the App. Your continued use of the App after changes constitutes acceptance of the updated Terms.

## 18. Termination

### 18.1 By You
You may stop using the App at any time. You can delete your data using "Reset All Data" in Settings and uninstall the App.

### 18.2 By Us
We reserve the right to suspend or terminate your access to the App if you violate these Terms or engage in conduct that we determine to be harmful to the App or its users.

### 18.3 Effect of Termination
Upon termination, your license to use the App ends. Your locally stored data remains on your device until you delete it. Unused credits are non-refundable upon termination for Terms violation.

## 19. Governing Law & Disputes

These Terms shall be governed by and construed in accordance with the laws of the Arab Republic of Egypt. Any disputes arising from these Terms or your use of the App shall be resolved through the competent courts of Cairo, Egypt.

## 20. Severability

If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.

## 21. Contact

If you have questions about these Terms, contact us at:
**Email:** laak@olanai.tech

---

*These Terms of Service were last updated on March 26, 2026.*',
   'en', 'published', '2026-03-26', 'cat-legal'),

  ('art-privacy', 'Privacy Policy', 'privacy-policy',
   'Privacy Policy for Laak — learn how we handle your investment data with on-device storage, minimal collection, and full transparency.',
   '**The short version:** Laak stores your portfolio data on your device. We collect minimal, anonymous usage data to improve the app — but we never collect personal information and we never sell your data. Period.

## 1. Who We Are

Laak is a portfolio visualization app operated by Olan ("we", "us", "our"). This Privacy Policy explains how we collect, use, and protect information when you use the Laak mobile application and website (collectively, "the Service").

## 2. Our Privacy Principles

Laak was built on three foundational privacy principles:

- **Private by design.** Your financial data stays on your device by default. It is only transmitted to our servers if you choose to enable cloud backup.
- **Minimal collection.** We collect only what is strictly necessary for the Service to function. If we don''t need it, we don''t ask for it.
- **Full transparency.** No hidden tracking, no surprise data sharing, no fine-print loopholes. This policy tells you everything.

## 3. Information We Do NOT Collect

To be absolutely clear, Laak does **not** collect:

- Your name, email address, or phone number (unless you opt into cloud backup)
- Your physical location or GPS coordinates
- Your device identifiers (IDFA, GAID, or fingerprints)
- Your contacts, photos, calendar, or other personal data
- Your browsing history
- Your brokerage credentials or bank account details
- Any biometric data (Face ID / Touch ID is handled by your OS, not by us)

We use anonymous, aggregated app usage analytics to improve the app (e.g., which features are used most, general navigation patterns). Our analytics provider does not receive your name, email, portfolio data, or any personally identifiable information. We do not use tracking pixels or advertising identifiers.

## 4. Information Stored On Your Device

### 4.1 Portfolio Data (User Database)

When you add holdings and transactions, this data is stored in an encrypted SQLite database on your device. This includes:

- Asset names, symbols, and types (stocks, gold, sukuk, crypto, etc.)
- Transaction details (quantity, price, fees, date, notes)
- Portfolio calculations derived from your entries

This data **never leaves your device** unless you explicitly enable cloud backup.

### 4.2 App Preferences

Your settings are stored locally in encrypted key-value storage (MMKV):

- Theme preference (light, dark, or system)
- Language selection
- Country and default market
- Screening authority preference
- Dismissed learning nudges

### 4.3 Cached Content (App Database)

The App caches content from our servers for offline access:

- Educational articles and categories
- Stock metadata (names, exchange codes, sectors)
- Market prices (symbol, price, last fetched time)
- Compliance screening rules and thresholds
- UI translation bundles
- Affiliate platform information

This cached data contains no personal information and can be cleared at any time from Settings. It is automatically rebuilt when you reconnect to the internet.

## 5. Information We Receive From Our Servers

### 5.1 API Requests

When your device is online, the App makes requests to our API to fetch content updates (articles, prices, translations). These requests contain:

- Standard HTTP headers (User-Agent, Accept-Language)
- Your IP address (visible to our infrastructure provider as part of standard networking)

We do not associate API requests with user identities and do not build usage profiles from them.

### 5.2 No Required User Accounts

By default, the App does not require an account. You can use Laak without providing any personal information. API requests are not tied to individual users unless you opt into cloud backup.

## 6. Cloud Backup (Optional, User-Initiated)

If you choose to sign in with Apple or Google and enable cloud backup:

### 6.1 What We Store

- Your authentication identifier (provided by Apple or Google — typically an opaque ID or email)
- An encrypted copy of your portfolio database
- Sync metadata (last backup timestamp)

### 6.2 Where We Store It

Cloud backups are stored on Cloudflare R2 object storage. Data is encrypted in transit (TLS) and at rest.

### 6.3 Who Can Access It

Only you, through your authenticated session. Our team does not access, read, or analyze individual backup files.

### 6.4 How to Delete It

You can delete your cloud backup at any time through the App. Upon deletion, your backup data is permanently removed from our servers.

## 7. AI-Powered Features & Data Processing

### 7.1 When AI Is Used

Laak offers optional AI-generated portfolio summaries. This feature is **never automatic** — it only activates when you explicitly request it and spend credits.

### 7.2 Data Sent to AI Provider

When you request an AI summary, a portfolio snapshot is sent to Anthropic (our AI provider) via their API:

- Asset types and their percentage of your portfolio
- Approximate values by asset class
- A portfolio hash (to avoid redundant processing)

### 7.3 Data NOT Sent to AI Provider

- Your name, email, or any personal identifier
- Individual transaction details
- Your device information or IP address
- Your location or any other app data

### 7.4 AI Provider''s Data Handling

Anthropic processes the data to generate a response and does not use API inputs to train its models. Refer to Anthropic''s Privacy Policy for their full data handling practices.

### 7.5 AI Output Storage

The AI-generated summary is stored locally on your device. It is not stored on our servers.

## 8. In-App Purchases

Credit purchases are processed entirely by Apple App Store or Google Play Store. We receive:

- A purchase confirmation (product ID, transaction ID)
- No payment details (no credit card numbers, no billing addresses)

Apple and Google handle all payment processing. Refer to their respective privacy policies for how they handle payment data.

## 9. Affiliate Links

The App may display contextual links to third-party financial platforms. When you tap an affiliate link:

- You leave Laak and enter the third-party''s website or app
- The link may contain a referral code identifying Laak as the source
- We do **not** track whether you completed a sign-up or made a purchase
- The third-party''s own privacy policy governs from that point forward

## 10. Children''s Privacy

Laak is not directed at children under 18. We do not knowingly collect information from minors. If you believe a child has provided data through the App, contact us and we will take steps to remove it.

## 11. Data Retention

- **On-device data:** Retained until you delete it (via "Reset All Data" or by uninstalling the App)
- **Cloud backup:** Retained until you delete it or request account deletion
- **Server logs:** We do not maintain user-identifiable server logs
- **AI processing:** Portfolio snapshots are not retained after the AI response is generated

## 12. Data Security

- **On-device encryption:** Portfolio data is stored in SQLite with OS-level encryption (iOS Data Protection, Android Keystore)
- **Preferences encryption:** MMKV provides encrypted key-value storage
- **Transit encryption:** All API communication uses HTTPS/TLS
- **Cloud backup encryption:** Encrypted at rest on Cloudflare R2
- **No hardcoded secrets:** API configuration is loaded from environment variables

## 13. Your Rights

Regardless of where you live, you have the right to:

- **Access** — view all data the App holds about you (it''s all on your device)
- **Delete** — remove all your data via "Reset All Data" in Settings
- **Export** — export your portfolio data (feature in development)
- **Withdraw consent** — disable cloud backup or stop using AI features at any time
- **Object** — since we don''t process your data for profiling or marketing, there''s nothing to object to

For GDPR, CCPA, or other data protection requests, contact us at laak@olanai.tech.

## 14. International Users

Laak is designed for users across MENA, Southeast Asia, and Africa. Since your portfolio data stays on your device by default, there are no cross-border data transfers to worry about. If you enable cloud backup, your data is stored on Cloudflare''s global infrastructure with data residency governed by Cloudflare''s policies.

## 15. Third-Party Services We Use

For full transparency, these are the only third-party services that may process any data in connection with Laak:

- **Cloudflare Workers** — hosts our API (processes standard HTTP requests)
- **Cloudflare R2** — stores cloud backups (only if you opt in)
- **Anthropic Claude API** — processes AI portfolio summaries (only when you request it)
- **Apple App Store / Google Play** — processes in-app purchases
- **Apple / Google Sign-In** — authenticates your identity (only if you opt in)

- **Analytics provider** — anonymous app usage analytics (no personal data sent)

We do not use any advertising networks or data brokers.

## 16. Cookies & Website

The Laak website (laak.app) is a static site. It does not use cookies, does not set local storage, and does not run any tracking scripts. There is no analytics on the website.

## 17. Changes to This Policy

We may update this Privacy Policy from time to time. Material changes will be communicated through the App. The "Last updated" date at the top reflects the most recent revision. Your continued use of the Service after changes constitutes acceptance.

## 18. Contact

If you have questions or concerns about this Privacy Policy, contact us at:

**Privacy inquiries:** laak@olanai.tech
**General support:** laak@olanai.tech

---

*This Privacy Policy was last updated on March 26, 2026.*',
   'en', 'published', '2026-03-26', 'cat-legal'),

-- Support Articles (EN)
  ('art-support-1', 'Getting Started', 'getting-started',
   'Everything you need to start using Laak — add holdings, view your portfolio, and check compliance.',
   'Laak is a private investment portfolio tracker that works entirely on your device. No account needed — just open the app and start adding your holdings.

### First steps

- **Add your first holding** — tap the "+" button, search for a stock by name or symbol, enter your quantity and purchase price.
- **View your portfolio** — your holdings appear on the home screen with real-time performance data.
- **Check compliance** — enable Sharia screening in Settings to see compliance status for each stock.',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-2', 'Managing Your Holdings', 'managing-holdings',
   'How to add, edit, and delete holdings in your portfolio.',
   'Your portfolio data is stored locally on your device. You have full control over what you add, edit, or remove.

### Adding a holding

Tap "+" on the portfolio screen. Search by stock name, ticker symbol, or market. Enter the number of shares and your average purchase price. You can also add transaction fees and notes.

### Editing a holding

Tap on any holding to view its details, then tap "Edit" to update quantity, price, or notes.

### Deleting a holding

Swipe left on a holding or use the delete option in the detail view. This action removes the holding from your local database only.',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-3', 'Compliance Screening', 'compliance-screening',
   'How Sharia compliance screening works in Laak, and how to choose your screening authority.',
   'Laak provides Sharia compliance screening data from recognized sources. This is an informational tool — not a fatwa or religious ruling.

### How screening works

- Screening data is sourced from established providers and standards (e.g., AAOIFI).
- Each stock shows a compliance status: **Compliant**, **Non-Compliant**, or **Doubtful**.
- Tap on any status to see the detailed breakdown of financial ratios and thresholds.

### Choosing a screening authority

Different scholars and institutions may apply different thresholds. You can select your preferred screening authority in Settings. The app will show results based on that authority''s methodology.

### Important note

Laak reports screening data — it does not issue rulings. The final decision on any investment is always yours. Consult a qualified scholar if you need a specific ruling.',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-4', 'Privacy & Your Data', 'privacy-and-data',
   'How Laak keeps your financial data private and how to manage your data.',
   'Laak is private by design. Your financial data never leaves your device unless you explicitly choose to back it up.

### What stays on your device

- All portfolio holdings and transactions
- Your app preferences and settings
- Cached market data and articles

### Resetting your data

Go to **Settings → Reset All Data** to permanently delete all local data. This cannot be undone unless you have a cloud backup.

### Biometric lock

Enable Face ID or Touch ID in Settings to require biometric authentication each time you open the app.',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-5', 'Cloud Backup', 'cloud-backup',
   'How to enable, restore, and delete cloud backups.',
   'Cloud backup is entirely optional. If you choose to enable it, your portfolio data is encrypted and stored securely.

### Enabling backup

Go to **Settings → Cloud Backup**. Sign in with Apple or Google. Your data will be encrypted and uploaded automatically.

### Restoring from backup

On a new device, sign in with the same Apple or Google account used for backup. Your portfolio will be restored automatically.

### Deleting your backup

Go to **Settings → Cloud Backup → Delete Backup**. This permanently removes your cloud data. Your local data remains unaffected.',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-6', 'AI-Powered Features', 'ai-features',
   'How AI portfolio summaries work, what data is shared, and how credits are used.',
   'Laak offers optional AI-generated portfolio summaries. These are never automatic — they only run when you request them.

### How it works

- Tap "Summarize" on your portfolio screen.
- A snapshot of your portfolio allocation is sent to our AI provider (Anthropic).
- You receive a plain-language summary of your portfolio composition.

### What is NOT sent

Your name, email, device info, individual transactions, and personal identifiers are never sent to the AI provider.

### Credits

AI features use credits. You can purchase credits through the app. Each summary request costs a set number of credits.',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-7', 'Offline Mode', 'offline-mode',
   'What works offline and what requires an internet connection.',
   'Laak is designed to work without internet. You can view your portfolio, check compliance status, and explore your data fully offline.

### What works offline

- Viewing your portfolio and all holdings
- Adding, editing, and deleting holdings
- Viewing cached compliance screening data
- Reading cached articles and content

### What needs internet

- Refreshing market prices
- Updating compliance screening data
- AI-powered summaries
- Cloud backup and restore',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-8', 'Contact & Feedback', 'contact',
   'How to reach us for support, bug reports, or feedback.',
   'We''d love to hear from you. Whether it''s a bug report, feature request, or general feedback — reach out anytime.

**Email:** laak@olanai.tech

We typically respond within 48 hours.',
   'en', 'published', '2026-03-29', 'cat-support'),

-- Support Articles (AR)
  ('art-support-ar-1', 'البداية', 'getting-started-ar',
   'كل ما تحتاجه لبدء استخدام «لك» — أضف استثماراتك، شاهد محفظتك، وتحقق من التوافق.',
   '«لك» متتبع محافظ استثمارية خاص يعمل بالكامل على جهازك. لا حاجة لحساب — افتح التطبيق وابدأ بإضافة استثماراتك.

### الخطوات الأولى

- **أضف أول استثمار** — اضغط على زر "+"، ابحث عن السهم بالاسم أو الرمز، أدخل الكمية وسعر الشراء.
- **شاهد محفظتك** — تظهر استثماراتك على الشاشة الرئيسية مع بيانات الأداء المحدّثة.
- **تحقق من التوافق** — فعّل الفحص الشرعي من الإعدادات لعرض حالة التوافق لكل سهم.',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-2', 'إدارة استثماراتك', 'managing-holdings-ar',
   'كيفية إضافة وتعديل وحذف الاستثمارات في محفظتك.',
   'بيانات محفظتك مخزّنة محلياً على جهازك. لديك تحكم كامل فيما تضيفه أو تعدّله أو تحذفه.

### إضافة استثمار

اضغط على "+" في شاشة المحفظة. ابحث بالاسم أو رمز السهم أو السوق. أدخل عدد الأسهم ومتوسط سعر الشراء. يمكنك أيضاً إضافة رسوم المعاملة وملاحظات.

### تعديل استثمار

اضغط على أي استثمار لعرض تفاصيله، ثم اضغط "تعديل" لتحديث الكمية أو السعر أو الملاحظات.

### حذف استثمار

اسحب يساراً على الاستثمار أو استخدم خيار الحذف في صفحة التفاصيل. هذا الإجراء يحذف الاستثمار من قاعدة بياناتك المحلية فقط.',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-3', 'الفحص الشرعي', 'compliance-screening-ar',
   'كيف يعمل فحص التوافق الشرعي في «لك»، وكيفية اختيار جهة الفحص.',
   'يوفر «لك» بيانات فحص التوافق الشرعي من مصادر معتمدة. هذه أداة معلوماتية — وليست فتوى أو حكماً شرعياً.

### كيف يعمل الفحص

- بيانات الفحص مصدرها جهات معتمدة ومعايير معترف بها (مثل AAOIFI).
- يعرض كل سهم حالة التوافق: **متوافق** أو **غير متوافق** أو **مشتبه**.
- اضغط على أي حالة لعرض التفصيل الكامل للنسب المالية والحدود المطبّقة.

### اختيار جهة الفحص

قد يطبّق علماء ومؤسسات مختلفة حدوداً مختلفة. يمكنك اختيار جهة الفحص المفضلة لديك من الإعدادات. سيعرض التطبيق النتائج وفقاً لمنهجية تلك الجهة.

### ملاحظة مهمة

«لك» يعرض بيانات الفحص — ولا يصدر أحكاماً. القرار النهائي بشأن أي استثمار يعود إليك دائماً. استشر عالماً مؤهلاً إن احتجت حكماً محدداً.',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-4', 'الخصوصية وبياناتك', 'privacy-and-data-ar',
   'كيف يحافظ «لك» على خصوصية بياناتك المالية وكيفية إدارة بياناتك.',
   '«لك» مصمّم للخصوصية أولاً. بياناتك المالية لا تغادر جهازك أبداً إلا إذا اخترت النسخ الاحتياطي.

### ما يبقى على جهازك

- جميع الاستثمارات والمعاملات
- تفضيلاتك وإعدادات التطبيق
- البيانات المؤقتة للأسعار والمقالات

### إعادة تعيين بياناتك

انتقل إلى **الإعدادات ← إعادة تعيين جميع البيانات** لحذف جميع البيانات المحلية نهائياً. لا يمكن التراجع عن هذا إلا إذا كان لديك نسخة احتياطية سحابية.

### القفل البيومتري

فعّل بصمة الوجه أو الإصبع من الإعدادات لطلب المصادقة البيومترية في كل مرة تفتح فيها التطبيق.',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-5', 'النسخ الاحتياطي السحابي', 'cloud-backup-ar',
   'كيفية تفعيل النسخ الاحتياطي السحابي والاستعادة والحذف.',
   'النسخ الاحتياطي السحابي اختياري بالكامل. إذا اخترت تفعيله، تُشفَّر بياناتك وتُخزَّن بأمان.

### تفعيل النسخ الاحتياطي

انتقل إلى **الإعدادات ← النسخ الاحتياطي السحابي**. سجّل الدخول بحساب Apple أو Google. ستُشفَّر بياناتك وتُرفع تلقائياً.

### الاستعادة من نسخة احتياطية

على جهاز جديد، سجّل الدخول بنفس حساب Apple أو Google المستخدم للنسخ الاحتياطي. ستُستعاد محفظتك تلقائياً.

### حذف النسخة الاحتياطية

انتقل إلى **الإعدادات ← النسخ الاحتياطي السحابي ← حذف النسخة**. هذا يحذف بياناتك السحابية نهائياً. بياناتك المحلية لا تتأثر.',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-6', 'ميزات الذكاء الاصطناعي', 'ai-features-ar',
   'كيف تعمل ملخصات الذكاء الاصطناعي، ما البيانات المشاركة، وكيف يُستخدم الرصيد.',
   'يوفر «لك» ملخصات محفظة اختيارية بالذكاء الاصطناعي. لا تعمل تلقائياً أبداً — تعمل فقط عند طلبك.

### كيف تعمل

- اضغط "تلخيص" في شاشة المحفظة.
- تُرسل لقطة من توزيع محفظتك إلى مزود الذكاء الاصطناعي (Anthropic).
- تحصل على ملخص بلغة واضحة عن تكوين محفظتك.

### ما لا يُرسل

اسمك وبريدك الإلكتروني ومعلومات جهازك ومعاملاتك الفردية وبياناتك الشخصية لا تُرسل أبداً إلى مزود الذكاء الاصطناعي.

### الرصيد

ميزات الذكاء الاصطناعي تستهلك رصيداً. يمكنك شراء رصيد من داخل التطبيق. كل طلب تلخيص يكلف عدداً محدداً من الرصيد.',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-7', 'وضع عدم الاتصال', 'offline-mode-ar',
   'ما يعمل بدون اتصال وما يحتاج إنترنت.',
   '«لك» مصمّم للعمل بدون إنترنت. يمكنك عرض محفظتك، والتحقق من حالة التوافق، واستكشاف بياناتك بالكامل بدون اتصال.

### ما يعمل بدون اتصال

- عرض محفظتك وجميع الاستثمارات
- إضافة وتعديل وحذف الاستثمارات
- عرض بيانات الفحص الشرعي المؤقتة
- قراءة المقالات والمحتوى المؤقت

### ما يحتاج إنترنت

- تحديث أسعار السوق
- تحديث بيانات الفحص الشرعي
- ملخصات الذكاء الاصطناعي
- النسخ الاحتياطي والاستعادة السحابية',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-8', 'التواصل والملاحظات', 'contact-ar',
   'كيفية التواصل معنا للدعم أو الإبلاغ عن مشاكل أو تقديم ملاحظات.',
   'نسعد بسماع رأيك. سواء كان بلاغ خطأ أو اقتراح ميزة أو ملاحظة عامة — تواصل معنا في أي وقت.

**البريد الإلكتروني:** laak@olanai.tech

نرد عادةً خلال ٤٨ ساعة.',
   'ar', 'published', '2026-03-29', 'cat-support'),

-- Support Articles: App Guides (EN)
  ('art-support-9', 'Your Portfolio at a Glance', 'portfolio-basics',
   'How to build and read your portfolio view in Laak.',
   'Laak gives you a clear, visual picture of everything you own — stocks, sukuk, gold, or crypto — all in one screen. To start, tap "+" and search by name or ticker. Enter the number of shares and your average cost. Your home screen updates instantly with total value, gain/loss, and allocation breakdown.

Tap any holding to see performance over time, cost basis, and weight in your portfolio. Swipe between tabs to explore different views. Everything runs on your device — no server calls, no lag. You can add holdings even without internet; prices update the next time you''re online.

Think of Laak as a private mirror for your investments. It shows what you have, how it''s moving, and where your money sits — without opinions or recommendations.',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-10', 'Settings & Preferences', 'settings-guide',
   'Customize Laak to fit how you invest and how you want your data handled.',
   'Open **Settings** from the tab bar to personalize your experience. Choose your default market and currency so new holdings match your region. Switch between light, dark, or system theme. Pick your preferred language — the entire interface adapts instantly.

For privacy, enable **Biometric Lock** to require Face ID or fingerprint every time you open the app. Your data never leaves your phone unless you turn on **Cloud Backup**, which encrypts and stores a copy you control.

If you follow a specific screening methodology, select your preferred **Screening Authority** here. This is optional — Laak works perfectly as a pure portfolio tracker without it. You can also reset cached data or clear everything from this screen. Settings are stored locally and sync with your backup if enabled.',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-11', 'Screening & Compliance', 'screening-guide',
   'How the optional compliance screening layer works in Laak.',
   'Laak is a portfolio visualizer first — but if compliance matters to you, screening is built right in as an optional layer. Enable it in **Settings → Screening Authority** and choose the methodology that matches your criteria (e.g., AAOIFI).

Once active, each holding shows a status badge: **Compliant**, **Non-Compliant**, or **Doubtful**. Tap the badge for a full breakdown — debt-to-market-cap, interest income ratio, and which thresholds apply. Screening data comes from recognized sources and updates when you''re online.

You can switch authorities anytime to compare results. Laak never tells you what to do with the data — it presents the numbers and the source, clearly. No recommendations, no pressure. If you don''t need screening, simply leave it off and use Laak as a straightforward investment tracker.',
   'en', 'published', '2026-03-29', 'cat-support'),

  ('art-support-12', 'Credits & Premium Features', 'credits-guide',
   'How credits work for AI summaries and premium features in Laak.',
   'Laak''s core experience — portfolio tracking, offline access, and screening — is free. Premium features like AI-powered portfolio summaries run on a simple credit system.

Credits are purchased inside the app through the App Store or Google Play. No subscription — you buy what you need, when you need it. Each AI summary costs a fixed number of credits. Tap **"Summarize"** on your portfolio to get a plain-language breakdown of your allocation, concentration, and trends.

The AI sees only your portfolio allocation percentages — never your name, email, transactions, or device info. Summaries are generated on demand and stored locally on your device.

Unused credits don''t expire. You can check your balance anytime in **Settings → Credits**. If you never use AI features, you never need credits — the rest of the app is fully functional without them.',
   'en', 'published', '2026-03-29', 'cat-support'),

-- Support Articles: App Guides (AR)
  ('art-support-ar-9', 'محفظتك في لمحة', 'portfolio-basics-ar',
   'كيف تبني وتقرأ عرض محفظتك في «لك».',
   '«لك» يعطيك صورة واضحة ومرئية لكل ما تملكه — أسهم أو صكوك أو ذهب أو عملات رقمية — في شاشة واحدة. للبدء، اضغط "+" وابحث بالاسم أو الرمز. أدخل عدد الأسهم ومتوسط التكلفة. تتحدّث الشاشة الرئيسية فوراً بالقيمة الإجمالية والربح/الخسارة وتوزيع المحفظة.

اضغط على أي استثمار لعرض الأداء عبر الزمن وأساس التكلفة ووزنه في المحفظة. اسحب بين التبويبات لاستكشاف عروض مختلفة. كل شيء يعمل على جهازك — بلا اتصال بخوادم وبلا تأخير. يمكنك إضافة استثمارات حتى بدون إنترنت؛ تتحدّث الأسعار عند عودة الاتصال.

فكّر في «لك» كمرآة خاصة لاستثماراتك. يُظهر ما تملكه وكيف يتحرك وأين يقع مالك — بدون آراء أو توصيات.',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-10', 'الإعدادات والتفضيلات', 'settings-guide-ar',
   'خصّص «لك» ليناسب أسلوب استثمارك وطريقة إدارتك لبياناتك.',
   'افتح **الإعدادات** من شريط التبويبات لتخصيص تجربتك. اختر سوقك وعملتك الافتراضية ليتوافق كل استثمار جديد مع منطقتك. بدّل بين المظهر الفاتح أو الداكن أو وضع النظام. اختر لغتك المفضلة — تتكيّف الواجهة بالكامل فوراً.

للخصوصية، فعّل **القفل البيومتري** لطلب بصمة الوجه أو الإصبع في كل مرة تفتح فيها التطبيق. بياناتك لا تغادر هاتفك أبداً إلا إذا فعّلت **النسخ الاحتياطي السحابي** الذي يُشفّر ويحفظ نسخة تتحكم فيها أنت.

إن كنت تتبع منهجية فحص محددة، اختر **جهة الفحص** المفضلة من هنا. هذا اختياري — «لك» يعمل بامتياز كمتتبع محفظة بحت بدونه. يمكنك أيضاً مسح البيانات المؤقتة أو إعادة تعيين كل شيء من هذه الشاشة.',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-11', 'الفحص والتوافق', 'screening-guide-ar',
   'كيف تعمل طبقة فحص التوافق الاختيارية في «لك».',
   '«لك» متتبع محافظ أولاً — لكن إن كان التوافق الشرعي يهمك، فالفحص مدمج كطبقة اختيارية. فعّله من **الإعدادات ← جهة الفحص** واختر المنهجية التي تناسب معاييرك (مثل AAOIFI).

بعد التفعيل، يظهر لكل استثمار شارة حالة: **متوافق** أو **غير متوافق** أو **مشتبه**. اضغط على الشارة لعرض التفصيل الكامل — نسبة الدين إلى القيمة السوقية، ونسبة إيرادات الفوائد، والحدود المطبّقة. بيانات الفحص مصدرها جهات معتمدة وتتحدّث عند الاتصال بالإنترنت.

يمكنك تبديل الجهات في أي وقت للمقارنة. «لك» لا يخبرك أبداً بما تفعل بالبيانات — يعرض الأرقام والمصدر بوضوح. لا توصيات ولا ضغوط. إن لم تحتج الفحص، اتركه معطّلاً واستخدم «لك» كمتتبع استثمارات مباشر.',
   'ar', 'published', '2026-03-29', 'cat-support'),

  ('art-support-ar-12', 'الرصيد والميزات المتقدمة', 'credits-guide-ar',
   'كيف يعمل الرصيد لملخصات الذكاء الاصطناعي والميزات المتقدمة في «لك».',
   'التجربة الأساسية في «لك» — تتبع المحفظة والوصول بدون إنترنت والفحص — مجانية. الميزات المتقدمة مثل ملخصات المحفظة بالذكاء الاصطناعي تعمل بنظام رصيد بسيط.

يُشترى الرصيد من داخل التطبيق عبر App Store أو Google Play. لا اشتراك — تشتري ما تحتاجه عندما تحتاجه. كل ملخص بالذكاء الاصطناعي يكلف عدداً ثابتاً من الرصيد. اضغط **"تلخيص"** في محفظتك للحصول على تحليل بلغة واضحة لتوزيع محفظتك وتركيزها واتجاهاتها.

الذكاء الاصطناعي يرى فقط نسب توزيع محفظتك — لا اسمك ولا بريدك ولا معاملاتك ولا معلومات جهازك. تُنشأ الملخصات عند الطلب وتُخزَّن محلياً على جهازك.

الرصيد غير المستخدم لا تنتهي صلاحيته. تحقق من رصيدك في **الإعدادات ← الرصيد**. إن لم تستخدم ميزات الذكاء الاصطناعي أبداً، لا تحتاج رصيداً — باقي التطبيق يعمل بالكامل بدونه.',
   'ar', 'published', '2026-03-29', 'cat-support');
