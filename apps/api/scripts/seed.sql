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

-- Migrate: Clean up old categories for existing databases
UPDATE articles SET category_id = 'cat-fundamentals' WHERE category_id = 'cat-basics';
DELETE FROM article_categories WHERE id = 'cat-basics';
DELETE FROM articles WHERE id IN ('art-1', 'art-2', 'art-3', 'art-4');

-- Seed: Article Categories
INSERT OR REPLACE INTO article_categories (id, title, slug, icon, "order", enabled, translations)
VALUES
  ('cat-fundamentals', 'Investing Fundamentals', 'investing-fundamentals', '📈', 1, 1, '{"ar":{"title":"أساسيات الاستثمار"}}'),
  ('cat-screening', 'Halal Screening', 'halal-screening', '✅', 2, 1, '{"ar":{"title":"الفحص الشرعي"}}'),
  ('cat-zakat', 'Zakat & Wealth', 'zakat-and-wealth', '🤲', 3, 1, '{"ar":{"title":"الزكاة والثروة"}}'),
  ('cat-market', 'Market Literacy', 'market-literacy', '🧭', 4, 1, '{"ar":{"title":"ثقافة الأسواق"}}'),
  ('cat-support', 'Support', 'support', '💬', 10, 1, '{"ar":{"title":"الدعم"}}'),
  ('cat-legal', 'Legal', 'legal', '📜', 99, 1, '{"ar":{"title":"قانوني"}}');

-- Seed: Articles
INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES

-- ============================================================
-- CATEGORY: Investing Fundamentals (cat-fundamentals) — 12 articles
-- ============================================================

  ('art-fund-1', 'What Is Investing?', 'what-is-investing',
   'The basic concept of investing — putting money to work so it can grow over time.',
   '**Investing** means using money to acquire something that has the potential to grow in value or generate income over time. Instead of leaving cash idle, investing puts it to work.

## Ownership vs. Lending

There are two broad ways to invest:
- **Ownership**: Buying a share of a company (stocks) or property (real estate). You participate in the gains and the risks.
- **Lending**: Giving money to a government or company in exchange for interest payments (bonds). In Islamic finance, many scholars consider conventional bonds impermissible due to riba (interest).

## Time Horizon

Investments behave differently over short and long periods. Markets fluctuate day to day, but historically, equities have trended upward over decades. The longer the time horizon, the more time there is to recover from downturns.

## Key Takeaway

Investing is not gambling — it is participating in real economic activity. Understanding what you own and why you own it is the foundation of informed investing.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-2', 'Stocks Explained Simply', 'stocks-explained',
   'What a stock actually represents — equity ownership in a real company.',
   'A **stock** (also called a share or equity) represents partial ownership in a company. When you buy one share of a company, you own a small piece of that business.

## What Ownership Means

As a shareholder, you have a claim on a portion of the company''s assets and earnings. If the company grows and becomes more profitable, the value of your shares generally increases. If the company struggles, the value may decline.

## Why Companies Issue Stock

Companies sell shares to raise capital — money they use to expand operations, develop products, or enter new markets. This is called an **initial public offering (IPO)** when it happens for the first time.

## How You Earn

There are two ways stocks generate returns:
- **Price appreciation**: The stock price rises above what you paid
- **Dividends**: Some companies distribute a portion of their profits to shareholders

## Important Note

Stock prices fluctuate constantly. Owning a stock means accepting that its value will go up and down over time.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-3', 'How to Read a Stock Quote', 'reading-stock-quote',
   'Understanding the key numbers in a stock quote — price, volume, market cap, and P/E ratio.',
   'A **stock quote** is a snapshot of a stock''s current trading data. Here are the key numbers and what they mean.

## Price

The current trading price per share. This changes throughout the trading day based on supply and demand.

## Volume

The number of shares traded during a given period. High volume means many buyers and sellers are active; low volume means less activity.

## Market Capitalization

**Market cap** = share price × total shares outstanding. It tells you the company''s total market value.
- **Large-cap**: Over $10 billion
- **Mid-cap**: $2–10 billion
- **Small-cap**: Under $2 billion

## P/E Ratio

**Price-to-Earnings ratio** = share price ÷ earnings per share. It indicates how much investors are paying for each dollar of profit. A higher P/E may suggest growth expectations; a lower P/E may suggest the stock is valued more conservatively.

These numbers together give a quick picture of a stock''s size, activity, and how the market values it.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-4', 'What Are Bonds?', 'what-are-bonds',
   'How bonds work as debt instruments — and why they raise concerns in Islamic finance.',
   'A **bond** is a loan made by an investor to a borrower — typically a corporation or government. The borrower agrees to pay back the principal plus interest over a set period.

## How Bonds Work

When you buy a bond, you are lending money. In return, you receive regular interest payments (called **coupons**) and get your principal back at maturity. The interest rate is fixed at issuance.

## Why Bonds Exist

Governments and companies issue bonds to raise money for projects, infrastructure, or operations without giving up ownership.

## Bonds and Islamic Finance

Conventional bonds are based on interest (riba), which is prohibited in Islamic finance according to the consensus of major scholarly bodies. The interest-based structure — lending money for a guaranteed return — is the core issue.

**Sukuk** are often described as the Islamic alternative. Unlike bonds, sukuk represent ownership in an underlying asset or project, and returns come from the asset''s performance rather than interest payments.

Understanding bonds is useful because they are a major part of global markets, even if they fall outside permissible investment for many Muslim investors.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-5', 'Understanding ETFs and Index Funds', 'etfs-and-index-funds',
   'How ETFs and index funds bundle stocks together for diversified, low-cost investing.',
   'An **ETF** (Exchange-Traded Fund) is a basket of stocks, bonds, or other assets that trades on a stock exchange like a single share. An **index fund** is a type of fund that tracks a specific market index.

## How They Work

Instead of buying individual stocks one by one, an ETF lets you buy a single fund that holds dozens or hundreds of companies. For example, an S&P 500 ETF holds shares in all 500 companies in that index.

## Active vs. Passive

- **Passive funds** track an index automatically — lower fees, no stock-picking
- **Active funds** have managers choosing stocks — higher fees, attempting to outperform

## Why ETFs Are Popular

- **Diversification**: One purchase spreads risk across many companies
- **Low cost**: Passive ETFs typically charge very small management fees
- **Accessibility**: You can buy a single share of an ETF, making them beginner-friendly

## Halal ETFs

Some ETFs are specifically designed with Sharia screening built in, automatically excluding companies that fail compliance criteria. These are sometimes labeled "Islamic" or "Shariah-compliant" ETFs.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-6', 'Dividends: What They Are and How They Work', 'dividends-explained',
   'How companies share profits with shareholders through dividend payments.',
   '**Dividends** are payments that some companies make to their shareholders, distributing a portion of their profits.

## How Dividends Work

A company''s board of directors decides whether to pay a dividend and how much. Dividends are typically paid quarterly (every three months), though some companies pay annually or semi-annually.

## Key Terms

- **Dividend yield**: Annual dividend ÷ share price. A stock priced at $100 paying $3/year has a 3% yield.
- **Ex-dividend date**: The cutoff date — you must own the stock before this date to receive the next payment.
- **Payout ratio**: The percentage of earnings paid as dividends. A high ratio may mean less money reinvested in growth.

## Not All Companies Pay Dividends

Growth companies often reinvest all profits back into the business instead of paying dividends. This is neither good nor bad — it depends on the company''s stage and strategy.

## Reinvestment

Some investors use dividends to buy more shares, compounding their returns over time. This is sometimes called a DRIP (Dividend Reinvestment Plan).',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-7', 'What Is Diversification?', 'what-is-diversification',
   'Why spreading investments across different assets and sectors helps manage risk.',
   '**Diversification** means spreading your investments across different assets, sectors, and geographies so that poor performance in one area doesn''t sink your entire portfolio.

## The Core Idea

Different investments respond differently to the same events. When tech stocks decline, healthcare or real estate might hold steady or rise. By owning a mix, you reduce the impact of any single loss.

## Types of Diversification

- **Across sectors**: Technology, healthcare, energy, consumer goods — each behaves differently
- **Across geographies**: Domestic and international markets don''t always move together
- **Across asset types**: Stocks, real estate, gold, sukuk — each has its own risk profile

## Concentration Risk

The opposite of diversification is concentration — putting most of your money in one stock or sector. If that single investment drops sharply, the impact on your portfolio is significant.

## A Practical Note

Diversification does not eliminate risk entirely — it manages it. All investments carry some level of risk. The goal is to avoid being overly exposed to a single point of failure.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-8', 'Risk and Return: The Basic Trade-Off', 'risk-and-return',
   'Understanding the relationship between potential reward and the risk of loss.',
   'In investing, **risk** and **return** are fundamentally linked. Investments with higher potential returns generally carry higher risk, and lower-risk investments typically offer more modest returns.

## What Is Risk?

Risk is the possibility that an investment''s actual return differs from what you expected — including the possibility of losing money. It comes in many forms:
- **Market risk**: The overall market declines
- **Company risk**: A specific company performs poorly
- **Currency risk**: Exchange rates move against you

## What Is Return?

Return is what you earn (or lose) on an investment. It includes price changes and any income (like dividends). Returns can be positive or negative.

## The Trade-Off

Historically, stocks have delivered higher average returns than savings accounts — but with significantly more volatility. A savings account is stable but grows slowly. Stocks can grow faster but can also lose value.

## Time Horizon Matters

Longer time horizons generally allow investors to tolerate more short-term volatility, because there is more time for markets to recover from downturns.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-9', 'Dollar-Cost Averaging', 'dollar-cost-averaging',
   'How investing a fixed amount at regular intervals smooths out market volatility.',
   '**Dollar-cost averaging (DCA)** is the practice of investing a fixed amount of money at regular intervals — regardless of whether markets are up or down.

## How It Works

Instead of investing a lump sum all at once, you invest the same amount every month (or week, or quarter). When prices are high, your fixed amount buys fewer shares. When prices are low, it buys more.

## Example

Investing $200 per month in a stock:
- Month 1: Price $20 → 10 shares
- Month 2: Price $25 → 8 shares
- Month 3: Price $16 → 12.5 shares
- **Total**: $600 invested, 30.5 shares, average cost ~$19.67/share

## Why It Works

DCA removes the pressure of trying to time the market — picking the "perfect" moment to buy. Since nobody can consistently predict short-term market movements, steady investing over time tends to smooth out the highs and lows.

## Important Note

DCA does not guarantee a profit or protect against loss in a declining market. It is a disciplined approach to building a position over time.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-10', 'Bull and Bear Markets', 'bull-and-bear-markets',
   'What market cycles are and how bull and bear markets are defined.',
   'Markets move in cycles. The two most commonly referenced phases are **bull markets** (rising) and **bear markets** (declining).

## Bull Market

A bull market is a period of sustained price increases, generally defined as a rise of 20% or more from a recent low. Bull markets are characterized by optimism, economic growth, and strong corporate earnings.

## Bear Market

A bear market is a decline of 20% or more from a recent high. Bear markets are often accompanied by economic slowdowns, rising unemployment, or financial crises. They can last months or years.

## Historical Context

Since 1950, U.S. markets have experienced multiple bear markets, but each was eventually followed by a recovery. Bull markets have historically lasted longer than bear markets on average.

## Cycles Are Normal

Markets do not move in one direction forever. Periods of growth are naturally followed by corrections or declines. Understanding this cycle helps set realistic expectations.

## Patience

Many long-term investors view bear markets as part of the journey rather than a reason to exit. Short-term declines, while uncomfortable, have historically been temporary.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-11', 'Reading Financial Statements', 'reading-financial-statements',
   'The three core financial statements and what each one tells you about a company.',
   'Every publicly traded company publishes financial statements. The three main ones are the **income statement**, **balance sheet**, and **cash flow statement**.

## Income Statement

Shows revenue, expenses, and profit over a period (usually a quarter or year). Key line items:
- **Revenue**: Total money earned from sales
- **Net income**: What''s left after all expenses — the "bottom line"

## Balance Sheet

A snapshot of what the company owns and owes at a specific point in time:
- **Assets**: Cash, property, equipment, inventory
- **Liabilities**: Debts, loans, obligations
- **Equity**: Assets minus liabilities — what belongs to shareholders

## Cash Flow Statement

Tracks actual cash moving in and out of the business:
- **Operating**: Cash from core business activities
- **Investing**: Cash spent on or earned from assets
- **Financing**: Cash from borrowing, repaying debt, or issuing shares

## Why It Matters

A company can be profitable on paper but running low on actual cash. Reading all three statements together gives a more complete picture of a company''s financial health.',
   'en', 'published', '2026-03-30', 'cat-fundamentals'),

  ('art-fund-12', 'What Are Fractional Shares?', 'fractional-shares',
   'How fractional shares make expensive stocks accessible to investors with smaller portfolios.',
   '**Fractional shares** allow you to buy a portion of a stock rather than a whole share. If a company''s stock costs $500 per share but you only want to invest $50, you can buy 0.1 of a share.

## How They Work

Many modern brokerages offer fractional share investing. You specify a dollar amount rather than a number of shares, and the brokerage handles the rest. You own a proportional claim on the stock''s performance and dividends.

## Why They Matter

Some of the most well-known companies have high share prices. Without fractional shares, investing in these companies would require hundreds or thousands of dollars per share, limiting access.

## Benefits

- **Accessibility**: Invest any amount in any stock, regardless of share price
- **Diversification**: Spread a small amount across multiple companies instead of concentrating in one
- **Dollar-cost averaging**: Invest fixed amounts regularly without worrying about share prices

## Limitations

Not all brokerages or markets support fractional shares. Availability varies by platform and region. Fractional shares may also have different rules around transferring between brokerages.',
   'en', 'published', '2026-03-30', 'cat-fundamentals');

-- ============================================================
-- CATEGORY: Halal Screening (cat-screening) — 10 articles
-- ============================================================

INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES
  ('art-screen-1', 'What Makes a Stock Halal?', 'what-makes-stock-halal',
   'The two-part test for Sharia compliance — business activity screening and financial ratio filtering.',
   'Determining whether a stock is halal involves a **two-part screening process** used by major Islamic finance bodies worldwide.

## Part 1: Business Activity Screening

The company''s core business must be permissible under Islamic law. Companies primarily involved in the following are typically excluded:
- Conventional banking and interest-based finance
- Alcohol production or distribution
- Pork-related products
- Gambling and gaming
- Tobacco
- Adult entertainment
- Weapons manufacturing

## Part 2: Financial Ratio Screening

Even if a company''s business is halal, its financial structure matters. Screening bodies examine ratios like debt levels, interest income, and impermissible revenue to ensure the company isn''t overly entangled with interest-based finance.

## Both Parts Must Pass

A technology company with a halal business model could still fail screening if it carries too much interest-bearing debt. Conversely, a company with clean finances but core haram revenue (like a brewery) would fail at the first step.

Screening standards vary between bodies — the thresholds differ, but the two-part structure is consistent across all major methodologies.',
   'en', 'published', '2026-03-30', 'cat-screening'),

  ('art-screen-2', 'The Three Financial Ratios', 'three-financial-ratios',
   'Debt, interest-bearing assets, and impermissible revenue — the key thresholds in Sharia screening.',
   'After a company passes business activity screening, three financial ratios determine whether its financial structure is acceptable.

## 1. Debt Ratio

Total interest-bearing debt divided by market capitalization (or total assets, depending on the standard). Under AAOIFI, this must be below **30%**. This ensures the company is not excessively financed through interest-based borrowing.

## 2. Cash and Interest-Bearing Securities

Cash held in interest-bearing accounts plus interest-bearing investments, divided by market capitalization. Also must be below **30%** under AAOIFI. This checks whether the company is earning significant income from interest.

## 3. Impermissible Revenue

Revenue from non-permissible activities divided by total revenue. Must be below **5%** under most standards. This captures companies with mostly halal operations but some peripheral haram income.

## Why Thresholds Exist

Very few public companies operate with zero exposure to conventional finance. Screening bodies established these thresholds to distinguish companies with minor, incidental exposure from those deeply embedded in interest-based systems. The exact percentages vary by standard.',
   'en', 'published', '2026-03-30', 'cat-screening'),

  ('art-screen-3', 'AAOIFI vs Other Screening Standards', 'screening-standards-compared',
   'Why different screening bodies set different thresholds — and why consistency matters.',
   'Several organizations have developed Sharia screening methodologies. While they share the same principles, the specific thresholds and denominators differ.

## Major Standards

- **AAOIFI** (Standard 21): Uses market capitalization as the denominator. Debt and interest thresholds at 30%. Widely used globally.
- **Dow Jones Islamic Market (DJIM)**: Uses 24-month average market cap. Thresholds at 33%.
- **S&P Shariah**: Uses 36-month average market value. Debt and cash at 33%, receivables at 49%.
- **MSCI Islamic**: Uses total assets as denominator. Thresholds at 33.33%.
- **FTSE Shariah (Yasaar)**: Uses total assets. Debt and cash at 33.33%, receivables at 50%.

## Why They Differ

Different scholars and advisory boards weigh the same principles differently. Some prefer market cap (reflecting market sentiment), others prefer total assets (a more stable accounting measure).

## Consistency Is Key

A stock might pass under one standard but fail under another. Rather than searching for the most lenient standard, many scholars emphasize choosing one methodology and applying it consistently across all holdings.',
   'en', 'published', '2026-03-30', 'cat-screening'),

  ('art-screen-4', 'Compliant, Non-Compliant, and Doubtful', 'compliance-statuses',
   'What each compliance status means and how to interpret screening results.',
   'When a stock is screened against Sharia criteria, it receives one of three statuses.

## Compliant

The company passes both business activity and financial ratio screening. Its core business is permissible and its financial ratios fall within acceptable thresholds. This does not mean the company is "perfectly halal" — it means it meets the criteria of the chosen screening standard.

## Non-Compliant

The company fails one or both parts of screening. Common reasons include:
- Core business involves prohibited activities (banking, alcohol, gambling)
- Financial ratios exceed the allowed thresholds
- Insufficient financial data available for screening

## Doubtful (Mashbooh)

The company falls in a gray area. This may happen when:
- Financial data is incomplete or outdated
- Ratios are very close to the threshold boundaries
- The business model has mixed elements that scholars interpret differently

## Important Context

Compliance status is based on a specific methodology and specific financial data at a specific point in time. It is a screening result, not a religious ruling. Statuses can change as company finances change.',
   'en', 'published', '2026-03-30', 'cat-screening'),

  ('art-screen-5', 'Sectors That Typically Pass Screening', 'sectors-that-pass',
   'Industries whose business models tend to align with Sharia screening criteria.',
   'While every company must be screened individually, some sectors tend to have higher rates of compliance due to the nature of their business activities.

## Technology

Software, cloud computing, and hardware companies generally earn revenue from permissible activities. Their products and services are inherently neutral. However, financial ratios still need to be checked.

## Healthcare

Pharmaceutical companies, medical device manufacturers, and health services typically pass business activity screening. The core activity — treating illness and improving health — is permissible.

## Consumer Goods

Companies producing food (non-alcohol), clothing, household products, and personal care items tend to pass. Check for alcohol-related product lines in diversified consumer companies.

## Real Estate

Real estate development and management companies often pass. However, some may have exposure to conventional mortgage financing, which affects financial ratio screening.

## Industrials & Materials

Manufacturing, construction, and raw materials companies usually have straightforward business models that pass activity screening.

## Always Screen Individually

Sector-level generalizations are starting points, not conclusions. A company in a "typically compliant" sector may still fail on financial ratios or have a subsidiary in a prohibited business.',
   'en', 'published', '2026-03-30', 'cat-screening'),

  ('art-screen-6', 'Sectors That Typically Fail Screening', 'sectors-that-fail',
   'Industries that commonly fail Sharia compliance screening — and the reasons why.',
   'Certain sectors consistently fail Sharia screening due to the nature of their core business activities.

## Conventional Banking & Finance

Banks, insurance companies, and financial institutions that operate on interest-based models fail at the business activity level. Interest (riba) is their primary revenue model.

## Alcohol

Companies that produce, distribute, or primarily sell alcoholic beverages are excluded. This includes breweries, distilleries, and some restaurant chains where alcohol is a major revenue source.

## Gambling & Gaming

Casinos, online gambling platforms, and companies whose primary revenue comes from games of chance are excluded.

## Tobacco

Tobacco manufacturing and distribution is considered harmful (darar) and is excluded by most screening standards.

## Adult Entertainment

Companies involved in producing or distributing adult content are excluded.

## Defense & Weapons

Some screening standards exclude weapons manufacturers, particularly those producing weapons of mass destruction.

## Important Nuance

Large conglomerate companies may have divisions in excluded sectors while their overall business is permissible. This is where the 5% impermissible revenue threshold becomes relevant — minor exposure may still pass screening under some standards.',
   'en', 'published', '2026-03-30', 'cat-screening'),

  ('art-screen-7', 'What Is Purification (Tazkiyah)?', 'what-is-purification',
   'When a compliant stock has minor impure income — how the cleansing concept works.',
   '**Purification** (tazkiyah) is the process of cleansing investment returns from the small portion of impermissible income that even compliant companies may earn.

## Why Purification Exists

A stock can pass Sharia screening while still earning a small amount (under 5%) from impermissible sources. For example, a technology company might earn a fraction of its revenue from interest on bank deposits. Screening allows this minor exposure, but the tainted portion of your returns needs to be "purified."

## How It Works

The basic concept is straightforward:
1. Determine the percentage of the company''s revenue that is impermissible
2. Apply that percentage to your dividends or capital gains
3. Donate that amount to charity (not as zakat — as a separate obligation)

## Example

If a company earns 2% of revenue from impermissible sources, and you receive $100 in dividends, then $2 needs to be purified — donated to charity.

## Purification Is Not Zakat

These are two separate obligations. Purification cleanses tainted income. Zakat is a wealth obligation calculated independently.',
   'en', 'published', '2026-03-30', 'cat-screening'),

  ('art-screen-8', 'How Screening Changes Over Time', 'screening-changes',
   'Why a stock''s compliance status can shift — and the importance of regular re-screening.',
   'A stock''s Sharia compliance status is not permanent. It can change as the company''s financial situation evolves.

## What Causes Changes

- **Debt levels fluctuate**: A company may take on new loans, pushing its debt ratio above the threshold
- **Revenue mix shifts**: An acquisition or new business line may introduce impermissible revenue
- **Cash positions change**: Large cash reserves deposited in interest-bearing accounts can tip the ratio
- **Market cap moves**: Since some standards use market capitalization as the denominator, a stock price drop can cause ratios to spike even without any operational change

## How Often to Check

Most screening providers update their assessments **quarterly**, aligned with when companies report financial results. Some investors check semi-annually or annually.

## What Happens When Status Changes

If a stock you own moves from compliant to non-compliant, scholars differ on the appropriate response. Some advise selling within a reasonable timeframe. Others allow holding until a natural exit point. Consulting a qualified scholar for guidance specific to your situation is advisable.

Re-screening is an ongoing part of maintaining a Sharia-aware portfolio.',
   'en', 'published', '2026-03-30', 'cat-screening'),

  ('art-screen-9', 'Common Myths About Halal Investing', 'halal-investing-myths',
   'Debunking misconceptions — from "stocks are gambling" to "halal means low returns."',
   'Several myths persist around halal investing. Here are some of the most common, examined against reality.

## "Stocks Are Gambling"

Buying a stock means owning part of a real business with real assets and employees. Gambling involves wagering on chance with no underlying economic activity. Stock investment involves analysis, ownership, and participation in economic value creation.

## "Halal Investing Means Low Returns"

Research from multiple providers (including S&P and MSCI) has shown that Sharia-compliant indices have performed comparably to — and sometimes outperformed — their conventional counterparts over long periods.

## "Only Islamic Banks Are Halal"

Compliance is determined by business activity and financial ratios, not by religious branding. Many technology, healthcare, and industrial companies pass screening without any Islamic label.

## "It''s Too Restrictive"

Sharia screens typically exclude about 30-40% of listed stocks. That still leaves thousands of investable companies globally across many sectors and geographies.

## "You Need a Scholar to Invest"

While scholarly guidance is valuable, established screening standards provide systematic, transparent criteria that any investor can apply and understand.',
   'en', 'published', '2026-03-30', 'cat-screening'),

  ('art-screen-10', 'Understanding Riba in Modern Finance', 'understanding-riba',
   'Where interest appears in modern financial systems — from banking to bonds to corporate debt.',
   '**Riba** (interest/usury) is one of the most clearly prohibited elements in Islamic finance. Understanding where it appears in modern systems is essential for informed investing.

## Riba in Banking

Conventional banks operate on an interest-based model. They pay interest on deposits and charge interest on loans. This is the most visible form of riba in daily life.

## Riba in Bonds

Conventional bonds are fundamentally interest-based instruments. The bondholder lends money and receives fixed interest payments. This structure is why most Islamic finance scholars consider conventional bonds impermissible.

## Riba in Corporate Finance

Even non-financial companies interact with riba through:
- **Corporate debt**: Loans from banks carry interest
- **Cash deposits**: Company cash held in interest-bearing accounts
- **Credit terms**: Some business arrangements involve implicit interest

## Why Screening Checks for It

This is why financial ratio screening exists — to measure how much a company is entangled with interest-based finance, even if its core business is permissible.

## The Scholarly Basis

The prohibition of riba is mentioned in multiple verses of the Quran (2:275-279, 3:130) and numerous hadith. The consensus among major Islamic scholarly bodies is that it applies to modern interest in all its forms.',
   'en', 'published', '2026-03-30', 'cat-screening');

-- ============================================================
-- CATEGORY: Zakat & Wealth (cat-zakat) — 8 articles
-- ============================================================

INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES
  ('art-zakat-1', 'Zakat on Investments: The Basics', 'zakat-investments-basics',
   'The fundamental obligation of zakat on wealth — who owes it, when, and the core rate.',
   '**Zakat** is one of the five pillars of Islam — an obligation to give a portion of your wealth to those in need. It applies to savings and investments that meet certain conditions.

## Who Owes Zakat?

Any Muslim whose wealth exceeds the **nisab** (minimum threshold) for a full lunar year owes zakat. This includes cash, gold, silver, stocks, and other investments.

## The Rate

The standard zakat rate on monetary wealth and investments is **2.5%** (1/40th) of the total qualifying wealth.

## When Is It Due?

Zakat becomes due when your wealth has been above the nisab for one complete **hawl** (lunar year). Many people choose a fixed annual date for simplicity.

## What Counts as Zakatable Wealth?

- Cash in bank accounts
- Market value of stocks and funds
- Gold and silver (above personal use thresholds, according to some scholars)
- Business inventory and receivables

## What Does Not Count

- Personal residence
- Personal vehicle
- Household furniture and clothing
- Tools used for earning a living

Zakat is a calculation on your net qualifying wealth — assets minus liabilities.',
   'en', 'published', '2026-03-30', 'cat-zakat'),

  ('art-zakat-2', 'Nisab: The Minimum Threshold', 'nisab-threshold',
   'Understanding the nisab — the minimum wealth level at which zakat becomes obligatory.',
   'The **nisab** is the minimum amount of wealth a Muslim must possess before zakat becomes obligatory. If your qualifying wealth is below the nisab, no zakat is due.

## Two Standards

The nisab can be calculated based on either:
- **Gold**: 85 grams of pure gold (approximately $5,000–$7,500 USD depending on current gold prices)
- **Silver**: 595 grams of pure silver (approximately $400–$600 USD)

## Which Standard to Use?

There is scholarly discussion on this. The silver standard results in a much lower threshold, meaning more people would owe zakat. The gold standard sets a higher threshold. Many contemporary scholars note that the silver standard better serves the purpose of zakat — ensuring wealth is shared — while others consider the gold standard more appropriate for modern economies.

## The Nisab Fluctuates

Since nisab is tied to commodity prices, it changes with the market. Check the current gold or silver price to determine the current nisab in your local currency.

## Important

The nisab must be maintained for a full lunar year (hawl) before zakat is due. Brief dips below the nisab during the year are handled differently by different scholars.',
   'en', 'published', '2026-03-30', 'cat-zakat'),

  ('art-zakat-3', 'Calculating Zakat on Stocks', 'zakat-on-stocks',
   'How zakat is calculated on stock portfolios — different approaches for different holding strategies.',
   'Calculating zakat on stocks depends on your role as an investor. Scholars generally distinguish between two approaches.

## Approach 1: Long-Term Investor

If you buy stocks to hold for dividends and long-term growth (not frequent trading), many scholars hold that zakat is due on your proportional share of the company''s **zakatable assets** — cash, receivables, and inventory.

In practice, this information can be difficult to obtain. As a simplification, some scholars accept paying 2.5% on the current market value of your holdings.

## Approach 2: Active Trader

If you buy and sell stocks frequently (treating them as trading goods), the entire market value of your portfolio is zakatable. On your zakat date, calculate 2.5% of the total portfolio value.

## Which Approach Applies?

The distinction is based on your **intention** at the time of purchase. There is no universal rule — intention-based classification is a personal determination.

## Practical Tip

Pick one consistent methodology and apply it every year. Record your zakat date, portfolio value, and calculation method so you can maintain consistency across years.',
   'en', 'published', '2026-03-30', 'cat-zakat'),

  ('art-zakat-4', 'Zakat on Gold and Silver', 'zakat-on-gold-silver',
   'How zakat applies to gold and silver holdings — weight, purity, and the scholarly discussion on jewelry.',
   'Gold and silver have their own specific zakat rules, rooted directly in prophetic traditions.

## Nisab for Gold

Zakat on gold is due when you possess **85 grams** of pure gold (24K) or its equivalent value. The rate is 2.5%.

## Nisab for Silver

Zakat on silver is due at **595 grams** of pure silver. The rate is also 2.5%.

## Calculating by Weight and Purity

If your gold is not 24K, adjust for purity:
- 22K gold: multiply weight by 22/24 to get pure gold equivalent
- 21K gold: multiply by 21/24
- 18K gold: multiply by 18/24

Then check if the pure gold equivalent exceeds 85 grams.

## The Jewelry Question

There is a well-known scholarly discussion about whether gold jewelry worn for personal use is subject to zakat. The Hanafi school generally holds that it is zakatable. The Shafi''i, Maliki, and Hanbali schools generally hold that personal-use jewelry is exempt, provided it is of a customary amount.

## Investment Gold

Gold held as an investment (bars, coins, or digital gold not worn as jewelry) is zakatable by consensus when it exceeds the nisab.',
   'en', 'published', '2026-03-30', 'cat-zakat'),

  ('art-zakat-5', 'When Is Your Zakat Due?', 'when-zakat-due',
   'Understanding the hawl (lunar year), choosing a zakat date, and maintaining consistency.',
   'Zakat becomes due when your wealth has exceeded the nisab for one complete **hawl** — a full lunar year (approximately 354 days).

## The Lunar Year

Islamic months follow a lunar calendar, which is about 11 days shorter than the Gregorian calendar. This means your zakat date shifts slightly earlier each Gregorian year.

## Choosing a Date

Many people simplify by choosing a fixed date — often the 1st of Ramadan or another memorable date. On that date each year, calculate your total qualifying wealth and pay 2.5%.

## What Happens on Your Zakat Date

On your chosen date:
1. Add up all qualifying wealth (cash, investments, gold, receivables)
2. Subtract any debts due within the year (scholars differ on which debts qualify)
3. Check if the net amount exceeds the nisab
4. If yes, pay 2.5% of the total

## Consistency Matters

The most important practice is consistency — choosing a method and date, then following it each year. Zakat is an obligation calculated on a snapshot of your wealth at a specific point in time.

## Early Payment

Most scholars permit paying zakat before its due date if you anticipate meeting the requirements.',
   'en', 'published', '2026-03-30', 'cat-zakat'),

  ('art-zakat-6', 'Zakat on Dividends and Profits', 'zakat-on-dividends',
   'Are dividends taxed separately for zakat? How scholars view investment income.',
   'A common question is whether dividends and investment profits require a separate zakat calculation on top of the zakat on stock holdings.

## The General View

Most scholars hold that dividends and profits do **not** require a separate zakat calculation. Here''s why: when you calculate zakat on your total wealth on your zakat date, dividends received are already included — they are part of your cash balance.

## How It Works in Practice

If you receive dividends throughout the year and they sit in your bank account, they become part of your overall cash balance on your zakat date. You pay 2.5% on your total qualifying wealth, which already includes those dividends.

## Reinvested Dividends

If dividends are automatically reinvested into more shares, those shares become part of your stock portfolio value — again, already captured in your zakat calculation.

## Capital Gains

Similarly, if you sell a stock at a profit, the proceeds become part of your cash balance. When your zakat date arrives, that cash is included in the total calculation.

## The Principle

Zakat is on wealth at a point in time, not on each individual transaction. This simplifies the calculation significantly.',
   'en', 'published', '2026-03-30', 'cat-zakat'),

  ('art-zakat-7', 'Zakat on Retirement Accounts', 'zakat-retirement-accounts',
   'How scholars view zakat on 401(k), IRA, and other restricted retirement accounts.',
   'Retirement accounts like **401(k)s** and **IRAs** raise unique zakat questions because the money is restricted — you typically can''t access it without penalties until a certain age.

## The Core Question: Accessibility

Zakat is generally due on wealth you own and can access. The debate around retirement accounts centers on whether restricted access changes the obligation.

## View 1: Zakat Is Due on Full Value

Some scholars hold that since you are the legal owner of the funds, zakat is due on the full current value of the account — even if withdrawal would trigger penalties. Ownership, not accessibility, is what matters in this view.

## View 2: Zakat Is Due Only on Accessible Portion

Other scholars argue that since early withdrawal incurs significant penalties (often 10% plus taxes), zakat is only due on the net amount you could actually access — or that zakat is deferred until you begin taking distributions.

## View 3: Zakat on Employer Match Only After Vesting

If your employer matches contributions, some scholars consider the unvested portion not yet fully yours and therefore not zakatable until vesting.

## Practical Guidance

This is an area where scholarly opinions genuinely differ. Many Muslim investors choose a position and apply it consistently each year.',
   'en', 'published', '2026-03-30', 'cat-zakat'),

  ('art-zakat-8', 'Purification vs Zakat', 'purification-vs-zakat',
   'Two separate obligations — purification cleanses tainted income, zakat is a wealth obligation.',
   '**Purification** and **zakat** are sometimes confused, but they are two distinct obligations with different purposes.

## Zakat

Zakat is a pillar of Islam — an annual obligation to give 2.5% of qualifying wealth to specific categories of recipients. It applies to all Muslims whose wealth exceeds the nisab for a full year. Zakat is calculated on your total qualifying wealth, regardless of how that wealth was earned.

## Purification (Tazkiyah)

Purification is specifically about cleansing investment returns from impermissible income. When a Sharia-compliant stock earns a small percentage (under 5%) of its revenue from impermissible sources, that tainted portion of your returns needs to be donated to charity.

## Key Differences

| | Zakat | Purification |
|---|---|---|
| **Basis** | Total qualifying wealth | Impermissible portion of investment returns |
| **Rate** | 2.5% of total | Matches the impermissible revenue percentage |
| **Recipients** | Specific zakat-eligible categories | General charity |
| **Frequency** | Annual | When dividends or gains are received |

## Both Apply

If you hold Sharia-compliant stocks, both obligations may apply simultaneously. Calculate and fulfill each one independently.',
   'en', 'published', '2026-03-30', 'cat-zakat');

-- ============================================================
-- CATEGORY: Market Literacy (cat-market) — 9 articles
-- ============================================================

INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES
  ('art-mkt-1', 'How Stock Exchanges Work', 'how-exchanges-work',
   'The role of stock exchanges — where buyers and sellers meet to trade shares.',
   'A **stock exchange** is an organized marketplace where shares of publicly listed companies are bought and sold. Major exchanges include the New York Stock Exchange (NYSE), NASDAQ, London Stock Exchange (LSE), and many regional exchanges worldwide.

## How Trading Works

When you place an order to buy a stock, the exchange matches your order with someone willing to sell at that price. This happens electronically in milliseconds. The exchange acts as the intermediary, ensuring both sides fulfill their obligations.

## Trading Hours

Each exchange operates during set hours. The NYSE, for example, is open Monday through Friday, 9:30 AM to 4:00 PM Eastern Time. Outside these hours, limited "pre-market" and "after-hours" trading may be available.

## Listing Requirements

Companies must meet specific financial and regulatory standards to be listed on an exchange. These include minimum revenue, market capitalization, and reporting requirements. Being listed provides credibility and access to a large pool of investors.

## The Role of Regulation

Exchanges are regulated by government agencies (like the SEC in the United States) to protect investors, ensure fair trading, and maintain market integrity.',
   'en', 'published', '2026-03-30', 'cat-market'),

  ('art-mkt-2', 'What Moves Stock Prices?', 'what-moves-prices',
   'The forces behind stock price movements — from earnings to sentiment to macroeconomics.',
   'Stock prices change constantly during trading hours. These movements are driven by the interaction of **supply and demand** — but what drives supply and demand?

## Company Earnings

When a company reports strong profits, demand for its stock often increases, pushing the price up. Disappointing earnings have the opposite effect. Quarterly earnings reports are among the most watched events in stock markets.

## Economic Data

Reports on employment, inflation, GDP growth, and consumer spending influence how investors feel about the economy — and by extension, about stocks.

## News and Events

Product launches, leadership changes, lawsuits, regulatory decisions, and geopolitical events can all move stock prices. The impact depends on how the news changes expectations about future profits.

## Interest Rates

When central banks raise interest rates, borrowing becomes more expensive and bonds become more attractive relative to stocks. This can pull money away from the stock market.

## Investor Sentiment

Markets are driven partly by psychology. Fear can trigger selling; optimism can drive buying — sometimes beyond what fundamentals justify. This is why prices sometimes appear irrational in the short term.',
   'en', 'published', '2026-03-30', 'cat-market'),

  ('art-mkt-3', 'Understanding Market Volatility', 'market-volatility',
   'Why markets swing up and down — and what volatility actually measures.',
   '**Volatility** measures how much and how quickly prices change. A highly volatile market sees large price swings in short periods. A stable market moves more gradually.

## What Causes Volatility

- **Economic uncertainty**: Unclear economic outlook makes investors nervous
- **Earnings surprises**: Better or worse than expected results cause rapid repricing
- **Geopolitical events**: Wars, elections, trade disputes create uncertainty
- **Low liquidity**: When fewer people are trading, individual trades have a bigger impact on prices

## Measuring Volatility

The **VIX** (often called the "fear index") measures expected volatility in the U.S. stock market over the next 30 days. A VIX above 30 generally indicates high uncertainty; below 15 suggests calm markets.

## Normal vs. Abnormal

Some volatility is completely normal and healthy — it reflects new information being incorporated into prices. Extreme volatility, such as during financial crises, reflects genuine systemic stress.

## Perspective

Daily swings of 1-2% may feel unsettling, but over decades, markets have historically absorbed even severe downturns. Volatility is the short-term cost of participating in long-term market growth.',
   'en', 'published', '2026-03-30', 'cat-market'),

  ('art-mkt-4', 'What Is Inflation?', 'what-is-inflation',
   'How inflation erodes purchasing power and why it matters for long-term savers and investors.',
   '**Inflation** is the rate at which the general level of prices rises over time, reducing what each unit of currency can buy.

## How It Works

If inflation is 3% per year, something that costs $100 today would cost approximately $103 next year. Your $100 buys less over time — this is called the erosion of **purchasing power**.

## Why It Matters for Investors

Cash sitting in a non-interest-bearing account loses real value during inflation. If your savings earn 0% and inflation is 3%, your money is effectively worth 3% less each year in terms of what it can actually buy.

## Common Causes

- **Demand-pull**: Too much money chasing too few goods
- **Cost-push**: Rising production costs (energy, labor) passed on to consumers
- **Monetary expansion**: Central banks printing more money increases the money supply

## How It''s Measured

In the U.S., the Consumer Price Index (CPI) tracks the average price change of a basket of goods and services over time. Most countries have similar measures.

## The Investing Connection

One reason people invest is to earn returns that outpace inflation, preserving or growing their purchasing power over time.',
   'en', 'published', '2026-03-30', 'cat-market'),

  ('art-mkt-5', 'Interest Rates and the Economy', 'interest-rates-economy',
   'How central bank interest rates ripple through markets and affect investment values.',
   '**Interest rates** set by central banks (like the U.S. Federal Reserve) are one of the most powerful tools in economic policy. They influence borrowing costs, spending, and investment across the entire economy.

## How It Works

When the central bank raises its benchmark rate, borrowing becomes more expensive for banks, businesses, and consumers. When it lowers the rate, borrowing becomes cheaper.

## Effect on Stocks

- **Rising rates**: Companies face higher borrowing costs, which can reduce profits. Investors may also shift money from stocks to bonds, which now offer better yields.
- **Falling rates**: Cheaper borrowing fuels business expansion. Stocks often become more attractive relative to low-yielding bonds.

## Effect on Bonds

Bond prices and interest rates move in opposite directions. When rates rise, existing bonds with lower rates become less valuable. When rates fall, existing bonds become more valuable.

## Why Central Banks Change Rates

Central banks raise rates to cool inflation and lower rates to stimulate economic growth during slowdowns. The goal is balancing growth with price stability.

## For Investors

Understanding rate trends provides context for market movements, even if predicting exact rate decisions is extremely difficult.',
   'en', 'published', '2026-03-30', 'cat-market'),

  ('art-mkt-6', 'What Is a Recession?', 'what-is-recession',
   'How recessions are defined, what causes them, and how they fit into economic cycles.',
   'A **recession** is a significant decline in economic activity that lasts for an extended period — typically defined as two consecutive quarters of negative GDP growth.

## What Happens During a Recession

- Businesses earn less revenue and may cut costs or lay off workers
- Unemployment rises
- Consumer spending drops
- Corporate earnings decline, which typically affects stock prices
- Central banks often respond by lowering interest rates

## Common Causes

- **Tightening monetary policy**: Interest rate increases can slow the economy too much
- **External shocks**: Oil crises, pandemics, or geopolitical disruptions
- **Asset bubbles bursting**: When overvalued markets (housing, tech) correct sharply
- **Loss of confidence**: When businesses and consumers pull back spending simultaneously

## Historical Context

Recessions are a normal part of economic cycles. The U.S. has experienced roughly a dozen recessions since World War II, varying in severity from mild slowdowns to severe crises like 2008.

## Recovery

Every recession in modern history has eventually been followed by a recovery. The duration and strength of recoveries vary, but economic contraction has never been permanent.

Markets often begin recovering before the economy does — sometimes while conditions still feel difficult.',
   'en', 'published', '2026-03-30', 'cat-market'),

  ('art-mkt-7', 'Market Orders vs Limit Orders', 'market-vs-limit-orders',
   'The two main order types when buying or selling stocks — and when each is appropriate.',
   'When you buy or sell a stock, the **order type** determines how and when your trade is executed.

## Market Order

A market order executes immediately at the best available price. You are saying: "Buy (or sell) this stock right now, at whatever the current price is."

**Pros**: Fast execution, guaranteed to be filled (if the market is open)
**Cons**: The exact price may differ from what you see — especially in fast-moving markets. This difference is called **slippage**.

## Limit Order

A limit order sets the maximum price you''re willing to pay (for buying) or the minimum you''re willing to accept (for selling). The trade only executes if the market reaches your price.

**Pros**: Price control — you know the worst-case price
**Cons**: No guarantee of execution. If the price never reaches your limit, the order won''t fill.

## When to Use Each

- **Market orders** are common for highly liquid stocks where the price difference between what you see and what you get is minimal.
- **Limit orders** are useful when you want a specific entry or exit price, or when trading less liquid stocks where prices can jump.',
   'en', 'published', '2026-03-30', 'cat-market'),

  ('art-mkt-8', 'What Is Market Capitalization?', 'market-capitalization',
   'How market cap categorizes companies by size — large-cap, mid-cap, and small-cap.',
   '**Market capitalization** (market cap) is the total market value of a company''s outstanding shares. It is calculated by multiplying the current share price by the total number of shares.

## The Formula

**Market Cap** = Share Price × Total Shares Outstanding

## Size Categories

- **Large-cap**: Over $10 billion. These are typically well-established companies with stable revenues. Examples include household-name technology and consumer companies.
- **Mid-cap**: $2–10 billion. Often companies in a growth phase — larger than startups but still expanding.
- **Small-cap**: Under $2 billion. Usually younger or niche companies with higher growth potential but also higher risk.

## Why Market Cap Matters

Market cap gives a quick sense of a company''s size and relative risk profile. Larger companies tend to be more stable but may grow more slowly. Smaller companies may grow faster but are generally more volatile.

## Not the Same as Company Value

Market cap reflects what the market is willing to pay, which can change with sentiment, news, and macroeconomic conditions. It doesn''t account for the company''s debts or assets — that''s what **enterprise value** measures.',
   'en', 'published', '2026-03-30', 'cat-market'),

  ('art-mkt-9', 'Understanding Sector Rotation', 'sector-rotation',
   'Why money flows between sectors during different phases of the economic cycle.',
   '**Sector rotation** is the tendency of money to flow from one industry sector to another as the economy moves through its cycle of expansion, peak, contraction, and recovery.

## The Idea

Different sectors perform better during different economic phases:
- **Early recovery**: Financials and consumer discretionary tend to lead as confidence returns
- **Mid-expansion**: Technology and industrials often perform well as businesses invest in growth
- **Late expansion**: Energy and materials may benefit from rising demand and commodity prices
- **Contraction**: Defensive sectors like healthcare, utilities, and consumer staples tend to hold up better because people need their products regardless of the economy

## Why It Happens

Investors anticipate where profits will grow next and shift capital accordingly. This creates a rotating pattern of sector outperformance.

## Practical Note

Sector rotation is observed historically, but it is not a precise, predictable clock. Cycles vary in length and magnitude. Many factors beyond the economic cycle — technology shifts, regulation, global events — also influence sector performance.

## For Learning

Understanding sector rotation helps explain why different parts of the market lead at different times, rather than everything rising or falling together.',
   'en', 'published', '2026-03-30', 'cat-market');

-- ============================================================
-- CATEGORY: Legal (cat-legal) — unchanged
-- ============================================================

INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES
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
   'en', 'published', '2026-03-26', 'cat-legal');

-- Support Articles (EN)
INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES
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
   'en', 'published', '2026-03-29', 'cat-support');

-- Support Articles (AR)
INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES
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
   'ar', 'published', '2026-03-29', 'cat-support');

-- Support Articles: App Guides (EN)
INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES
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
   'en', 'published', '2026-03-29', 'cat-support');

-- Support Articles: App Guides (AR)
INSERT OR IGNORE INTO articles (id, title, slug, summary, body, language_code, status, published_at, category_id)
VALUES
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
