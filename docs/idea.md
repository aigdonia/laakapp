# Halal Wealth Visualizer — Product Direction Document

> A private, visual calculator that shows you what you own, how it's doing, and where it stands on Sharia compliance — in plain language.

**Status:** Direction locked
**Date:** March 2026

---

## 1. Vision

A mobile utility tool for beginner and mid-level investors — primarily Muslim investors in developing markets (MENA, Southeast Asia, Africa) — who want a calm, clear, and private way to understand their investment portfolio. The app works for any investor worldwide but is purpose-built for the halal-conscious audience.

The app is **not** a financial advisor, recommendation engine, or trading platform. It is a **calculator, translator, and reporter**. It shows. It never tells you what to do.

---

## 2. Target Market

### Primary Audience
- ~1.9 billion Muslims globally
- Islamic finance is a ~$5.1 trillion industry growing ~10.7% CAGR (2025-2031)
- Retail consumers represent ~11.4% of total Islamic finance — SOM is ~$150-200M ARR for the consumer fintech niche
- Young, mobile-first populations in MENA, Southeast Asia, and Africa
- Underserved by existing tools — professional screeners are expensive, consumer apps are generic

### Why Now
- Rising interest in halal investing among younger demographics
- No dominant consumer app owns this space (competitors improving but gaps remain)
- LLM integration creates a new UX paradigm for financial literacy
- Privacy concerns growing globally, especially around financial data

### Market Launch Sequence (Phased, Reality-Checked)

The app launches market-by-market, not globally. Each market has different economics, regulatory posture, and data accessibility.

**Phase 1: Egypt (Months 1-4) — The Testing Ground**

| Factor | Detail |
|---|---|
| Population | 110M+, largest Arab market |
| Stock universe | EGX — ~220 actively traded stocks (manually curatable) |
| Screening data | Manual curation from EGX public financial reports + AAOIFI thresholds |
| Screening cost | $0 — small universe, publicly available financials |
| Price data | EODHD ($20-80/mo) or EGX public end-of-day data |
| Organic growth | LIKELY — high "financial curiosity," low competition, strong word-of-mouth |
| Conversion rate | 2-3% (low credit card penetration, but mobile wallets growing: Vodafone Cash, InstaPay, Fawry) |
| Credit model fit | HIGH — prepaid culture aligns with top-up credits |
| Regulatory | Safer grey area — FRA allows app-based brokerage marketing, "pure visualization" not classified as advice (monitor) |
| Role | Refine product, prove credit model, collect feedback cheaply |

**Phase 2: Saudi/GCC (Months 4-8) — The Revenue Engine**

| Factor | Detail |
|---|---|
| Population | KSA 36M+, GCC ~60M total, highest disposable income in MENA |
| Stock universe | Tadawul — ~200 listed companies (manually curatable) |
| Screening data | Manual curation from Tadawul public financials + AAOIFI thresholds |
| Screening cost | $0 at launch — small universe. Upgrade to API when revenue justifies |
| Price data | Twelve Data or Tadawul API — well-supported by global providers |
| Organic growth | UNLIKELY without marketing — KSA is a "paid growth" market with high CAC |
| Conversion rate | 5%+ (high disposable income, willingness to pay for compliance tools) |
| Credit model fit | MODERATE — Saudi users prefer "set and forget." Promote "Unlock All $14.99" prominently |
| Regulatory | STRICT — SAMA and CMA protective. Must research CMA stance on Sharia classification BEFORE launch. May need "community data" framing vs "screening verdict" |
| Role | Revenue engine, high-value users, acquirer visibility |

**Phase 3: Malaysia/SEA (Months 8-12) — The Scale Play**

| Factor | Detail |
|---|---|
| Population | Malaysia 33M+, Indonesia 280M+, largest Muslim population globally |
| Stock universe | Bursa Malaysia ~1,000 stocks, IDX ~800 stocks |
| Screening data | Malaysia Securities Commission publishes free Shariah-compliant list (twice yearly, May + November) |
| Screening cost | $0 for Malaysia — free government-published list |
| Price data | Well-covered by all major APIs |
| Organic growth | LIKELY — high app-literacy, established Islamic finance communities |
| Conversion rate | 4% (established culture of paying for digital Islamic services) |
| Credit model fit | MODERATE — subscriptions common in Malaysia, top-ups work better in Indonesia |
| Regulatory | MODERATE — well-defined fintech sandbox programs (BNM Malaysia, OJK Indonesia) |
| Role | Scale play, prove multi-market viability, strengthen flip valuation |

**Combined Market Strategy: Egypt + Saudi + Malaysia = ~620 stocks to screen at launch**

This is a manageable dataset. No need for expensive global screening APIs. Manual curation + free government lists cover all three markets.

### Market-Specific Monetization Tuning

| Market | Primary Model | Secondary | "Unlock All" Prominence |
|---|---|---|---|
| Egypt | Credits (prepaid culture) | Affiliates | Low — users prefer per-use |
| Saudi/GCC | "Unlock All" lifetime ($14.99) | Credits for AI queries | HIGH — "set and forget" preference |
| Malaysia | Credits + subscription option | Affiliates | Medium |

---

## 3. Identity — What the App Is and Is Not

| The App IS | The App IS NOT |
|---|---|
| A calculator | A recommendation engine |
| A mirror showing what you own | A guide telling what to buy |
| A translator of financial data into plain language | A financial advisor |
| A Sharia screening reporter (reporting 3rd party data) | A Sharia authority |
| A visualization tool | A trading platform |

---

## 4. Core Principles

### 4.1 Private by Design
- All portfolio data stored on-device (SQLite) unless user opts into cloud backup
- Anonymous account created silently on first launch (UUID) — user never sees a signup form
- No broker logins
- Biometric lock (Face ID / fingerprint)
- Local backup and restore
- Optional identified account (Sign in with Apple/Google) for cloud backup and cross-device sync
- Marketing message: "No email required. No account forms. Your data stays on your device."

### 4.2 Offline-First
- Full portfolio tracking works without internet
- Prices sync when online, cached for offline use
- LLM/AI features require internet (clearly communicated as premium online features)
- Designed for markets with unreliable connectivity

### 4.3 Narrative Visualization
- Every screen answers a plain-language question
- Data is translated into stories, not dashboards full of numbers
- Beginners see clarity, mid-level users find depth on tap

### 4.4 Progressive Disclosure
The app serves beginners and mid-level investors without a mode switch:

```
Layer 1 — Glance (everyone sees this)
  "Apple — +12.4% — Compliant"

Layer 2 — Tap to understand (beginner explores here)
  "You bought 10 shares at $142. Now worth $159.
   You've gained $170 total.
   Sharia status: Compliant
   Debt ratio: 18% (threshold: 33%)"

Layer 3 — Expand for detail (mid-level lives here)
  "Revenue breakdown: 100% permissible
   Debt/Market Cap: 18.2% (AAOIFI limit: 33.33%)
   Cash+Interest / Market Cap: 4.1% (limit: 33.33%)
   Receivables / Market Cap: 22% (limit: 49%)
   Purification per share: $0.12/year
   Screening source: AAOIFI methodology
   Last updated: March 2026"
```

### 4.5 Utility, Not Advisory
- Every feature is framed as a calculator, translator, or reporter
- AI never says "you should" — it reports, explains, compares
- All screening data attributed to source and methodology
- Disclaimers visible where they matter, not buried in settings

---

## 5. Account Strategy

### 5.1 Three-Tier Account Model

The app uses a silent progressive account system. The user never encounters a signup wall.

| Tier | When Created | What It Is | User Sees |
|---|---|---|---|
| **Anonymous** | First launch (automatic) | UUID generated on device, synced to server | Nothing — feels like no account |
| **Purchased** | First credit buy | App Store receipt tied to anonymous UUID | Nothing — App Store handles payment |
| **Identified** | User opts in (never forced) | Apple/Google sign-in, enables cloud backup | One-tap sign-in when they choose |

### 5.2 What the Server Stores vs Device

| Data | Location | Why |
|---|---|---|
| Portfolio holdings | **Device only** (unless cloud backup opted in) | Core privacy promise |
| Price cache | Device | Offline-first |
| Sharia screening cache | Device | Offline-first |
| Credit balance | Device + Server | Prevent loss, validate purchases |
| Purchase receipts | Server | App Store validation |
| Anonymous UUID | Device + Server | Link purchases to credit balance |
| Email / auth provider | Server (only if identified) | Cloud backup, cross-device sync |

The server is deliberately dumb. It knows how many credits an anonymous UUID has. Nothing about their portfolio, holdings, or financial data.

### 5.3 Account Data Model

```
anonymous_account:
  id: UUID (generated on first launch)
  created_at: timestamp
  credit_balance: int
  purchases: [receipt_ids]
  identified: false

identified_account (after opt-in):
  id: same UUID
  auth_provider: apple | google | email
  email: (encrypted, only if provided)
  identified: true
  cloud_backup: true | false
```

### 5.4 Reinstall Handling

| Scenario | What Happens |
|---|---|
| Reinstall, never purchased | New anonymous UUID, fresh 20 welcome credits (costs ~$0.10, acceptable) |
| Reinstall, had purchases | "Restore purchases" via App Store recovers credits, ties to same UUID |
| Reinstall, had identified account | Sign in with Apple/Google restores everything |

### 5.5 Nudges Toward Identified Account

Never a popup. Always in context. Always skippable.

| Natural Moment | Nudge |
|---|---|
| After 3rd credit purchase | "Secure your credits — sign in to prevent loss if you switch phones" |
| Portfolio reaches 10+ holdings | "Your portfolio is growing. Want cloud backup?" |
| User taps "Export" or "Backup" | "Sign in to enable automatic cloud backup" |

---

## 6. User Personas & Onboarding

### 6.1 Persona 1: Amira (Beginner)
- Just started investing, 3-5 holdings
- Doesn't know what a P/E ratio is, doesn't care
- Wants to know: "Is my money growing? Is it halal?"
- Intimidated by complex charts
- Needs: clarity, simplicity, confidence-building

### 6.2 Persona 2: Khalid (Mid-Level)
- 15-30 holdings across multiple asset classes
- Understands basics, wants to optimize
- Wants to know: "Am I diversified enough? How do I improve compliance?"
- Frustrated by tools that are either too simple or too complex
- Needs: depth on demand, comparison tools, efficiency

### 6.3 Natural Segmentation — The Portfolio Tells You Who They Are

No surveys, no "select your experience level." The onboarding flow and portfolio size reveal the user type organically.

| Signal | Amira (Beginner) | Khalid (Mid-Level) |
|---|---|---|
| Portfolio size at entry | 1-5 holdings | 10-30 holdings |
| Entry method | Quick-Add Wizard, one at a time | CSV import or rapid manual entry |
| Credit burn rate | 20 credits over 2-4 weeks | 20 credits in 3-7 days |
| Conversion timeline | Week 4-5 | Day 5-7 |
| Primary value driver | Learning + clarity | Efficiency + depth |

### 6.4 Smart Onboarding Flow

```
Step 1: "What do you own?"
         [Add my first investment]        → Amira path
         [Import my portfolio (CSV)]      → Khalid path
         [Just exploring]                 → Window shopper

Step 2 (Amira path): Quick-Add Wizard
         "What did you buy?" → Apple
         "How much did you spend?" → $1,420
         "Done. Here's your portfolio."
         → Sees Command Center with 1 holding
         → "Want to understand Apple's Sharia status? (1 credit)"
         → Hooked.

Step 2 (Khalid path): CSV import or rapid manual entry
         → Sees Command Center with full portfolio
         → Compliance bar: "68% compliant"
         → Immediately wants: "Which ones aren't compliant?"
         → Burns 5-10 credits in first session
         → Hooked faster. Buys credits within a week.
```

### 6.5 Welcome Credits — 20 Free Credits on First Launch

No trial timer. No account form. No email. Credits appear on first launch.

```
First launch:
  "Welcome. Here's 20 credits to explore premium features.
   No account needed. No expiration."

  [Start exploring]
```

### 6.6 Credit Burn Patterns by Persona

**Amira (beginner, builds portfolio slowly):**

| Week | Action | Credits Used | Balance |
|---|---|---|---|
| 1 | Adds Apple, checks compliance | 1 | 19 |
| 1 | Unlocks a theme (personalizes app) | 5 | 14 |
| 2 | Adds 2nd stock, checks compliance | 1 | 13 |
| 2 | "What does debt ratio mean?" | 1 | 12 |
| 3 | Adds 3rd holding, portfolio analysis | 3 | 9 |
| 3 | Exports purification report | 2 | 7 |
| 4 | Adds 4th holding, checks 2 stocks | 2 | 5 |
| 4 | Portfolio analysis again | 3 | 2 |
| **Week 5** | **Credits low → natural purchase moment** | | **2** |

By week 5 the app is part of her routine. Portfolio has emotional weight. $1.99 is obvious.

**Khalid (mid-level, imports portfolio day one):**

| Day | Action | Credits Used | Balance |
|---|---|---|---|
| 1 | Imports 20 holdings | 0 | 20 |
| 1 | Portfolio analysis | 3 | 17 |
| 1 | Checks 5 non-compliant stocks | 5 | 12 |
| 2 | Screening comparison (AAOIFI vs DJIM) | 2 | 10 |
| 3 | Checks 4 more stocks | 4 | 6 |
| 4 | What-if calculation | 2 | 4 |
| 5 | Portfolio analysis after changes | 3 | 1 |
| **Day 5-7** | **Credits gone → purchase moment** | | **1** |

Entire portfolio is in the app. Switching cost is real. $4.99 for 150 credits is a no-brainer.

### 6.7 Post-Credits Experience

When credits run out, nothing breaks. The free app continues working perfectly.

```
"You've used your welcome credits. Your portfolio
 is still here, fully private, fully offline.

 Want more AI insights and tools?

 [  50 credits — $1.99 ]
 [ 150 credits — $4.99 ]  ← Best value
 [ 400 credits — $9.99 ]"
```

No countdown timer. No degraded experience. No pressure.

---

## 7. Home Screen — "Command Center"

The first screen answers 3 Big Questions without scrolling or tapping.

### Question 1: "How much do I have in total?"
- **Visual:** Stacked Growth Area Chart (Cash, Stocks, Gold, Crypto layered over time)
- **Why:** Visually proves diversification — "even if stocks are down, gold and cash provide a floor"

### Question 2: "Am I making or losing money?"
- **Visual:** Contribution vs Value split bar
- **Why:** Separates deposits from actual gains — "Did I profit, or did I just deposit more?"

### Question 3: "Where is my money sitting?"
- **Visual:** Treemap (not donut chart)
- **Why:** Scales better with many holdings, intuitive size comparison

### Plus: Compliance Bar
- "78% Sharia Compliant" with visual progress bar
- Tap to see breakdown

```
+-----------------------------------+
|  Total Wealth           ^ 3.2%    |
|  Stacked area chart               |
|  [Cash][Stocks][Gold][Crypto]     |
+-----------------------------------+
|  You invested    It's worth now   |
|  [$12,400]  ->   [$13,190]        |
|  Real profit: +$790 (+6.4%)       |
+-----------------------------------+
|  Allocation Treemap               |
|  +----------+------+----+         |
|  |  AAPL    | Gold |SAR |         |
|  |  34%     | 22%  |18% |         |
|  +------+---+--+---+----+         |
|  | MSFT | STC  | Cash   |         |
|  +------+------+--------+         |
|                                   |
|  78% Sharia Compliant ========--  |
+-----------------------------------+
```

---

## 8. Feature Set

### 8.1 Free Tier (Offline Core)

**Portfolio Entry**
- Quick-Add Wizard (3 steps: what did you buy, how much, done)
- Edit/delete holdings, stock split tracking
- CSV import for bulk entry
- Multi-currency with cached conversion rates
- Supported assets: Stocks, ETFs, Sukuk, Crypto, Gold, Cash, Real Estate (manual value)

**Visualization & Performance**
- Command Center dashboard (3 cards above)
- Stacked growth area chart
- Contribution vs Value split bar
- Treemap allocation view
- Per-holding gain/loss list
- Daily, weekly, monthly, YTD, all-time performance

**Basic Sharia Layer**
- Halal / Questionable / Non-compliant flag per stock (cached 3rd party data)
- Portfolio compliance percentage bar
- Simple reason per stock ("debt ratio exceeds threshold")
- Screening source attribution on every result

**Privacy & Essentials**
- Biometric lock
- All data on-device (SQLite)
- Local backup and restore (JSON export/import)
- Dark mode
- Arabic + English (more languages in future: Malay, Urdu, Bahasa, French)
- Price sync when online, full offline from cache

### 8.2 Paid Features (Credit System)

All premium features are unlocked and consumed via an in-app credit system. Credits never expire. See Section 13 for full monetization details, cost breakdown, and profitability analysis.

**Credit Packages**

| Package | Price (Western) | Price (Developing) | Credits | Cost Per Credit |
|---|---|---|---|---|
| Starter Pack | $1.99 | $0.99 | 50 | $0.04 / $0.02 |
| Value Pack | $4.99 | $2.49 | 150 | $0.03 / $0.017 |
| Power Pack | $9.99 | $4.99 | 400 | $0.025 / $0.012 |

**AI Features (consume credits per use)**

| Action | Credits | Description |
|---|---|---|
| AI stock explanation | 1 | Plain language explanation of a stock's compliance status |
| AI screening comparison | 2 | Compare a stock across AAOIFI, DJIM, S&P methodologies |
| AI portfolio analysis | 2 | Concentration, compliance breakdown, allocation insights |
| What-if calculation | 2 | User inputs hypothetical changes, app shows the math |
| AI stock screener query | 1 | "Show me halal tech stocks under $30" |
| PDF report export | 2 | Purification report, zakat report, portfolio summary |

**Feature Unlocks (one-time credit spend, permanent)**

| Feature | Credits | Description |
|---|---|---|
| Extra portfolio slot | 10 | Separate portfolios for retirement, trading, family |
| Theme pack | 5 | Colors, chart styles, appearance |
| Home widget | 5 | iOS/Android glance at portfolio |
| Dividend & income tracker | 15 | Track dividend income, project annual income |
| Advanced Sharia screening | 15 | Choose between AAOIFI, DJIM, S&P Sharia methodologies |
| Savings projection tool | 5 | "If I add $200/month, deposits total $X in Y years" |
| Shareable Wealth Snapshot | 5 | Anonymous card — compliance %, growth curve, no currency values |
| Watchlist + status alerts | 10 | "STC screening status changed" — factual, no action suggested |
| Benchmark comparison | 10 | Compare portfolio against DJIM, S&P Sharia, FTSE Shariah indices |
| Performance analytics | 10 | Sharpe ratio, volatility, max drawdown |
| Zakat estimator | 10 | Estimate zakat on investment holdings |
| Purification calculator | 10 | Calculate purification amounts per holding |

**Credit Spend Examples**

A $4.99 Value Pack (150 credits) could be used as:
- Unlock 3 features (e.g., dividend tracker + zakat + themes = 30 credits) + 120 AI queries
- Unlock all features (110 credits) + 40 AI queries
- Pure AI usage: 150 stock explanations or 50 portfolio analyses

### 8.3 Auto Top-Up (Optional Recurring)

For users who want a hands-off experience without a formal subscription:

| Option | Details |
|---|---|
| Auto top-up | "Automatically add 50 credits when balance drops below 5 — $1.99/refill" |

- User opts in, can opt out anytime
- Only charges when they're actively using the app
- Gives recurring revenue metrics without subscription churn
- Feels fair — pay only when consuming

### 8.4 Pricing Strategy
- Credit-based model — pay-as-you-go, no recurring commitment
- Credits never expire — builds trust, no pressure
- Regional pricing: developing markets get ~50% discount on credit packages
- Free tier must feel generous, not crippled
- Free app alone should be the best halal portfolio tracker available
- Pay-as-you-go aligns with developing market spending habits (prepaid culture)
- 20 welcome credits on first launch — no account form, no timer

---

## 9. AI Layer — Utility, Not Advisor

The LLM is the **voice of the app** — it translates, explains, and calculates. It never recommends.

### AI Interaction Examples

**Beginner (Amira):**
- "Is my portfolio okay?" -> "You have 5 holdings, 4 are Sharia-compliant. Your portfolio grew 6% since you started. Your money is mostly in tech stocks."
- "What does compliant mean?" -> "Sharia screening checks if a company's debt, cash from interest, and business activities stay within limits set by Islamic scholars. [methodology name] sets the limits your app uses."

**Mid-Level (Khalid):**
- "Show me my concentration risk" -> "48% of your portfolio is in one sector (tech). Your top holding is 34% of total value. Here's your sector breakdown: [table]"
- "Compare my compliance across methodologies" -> "Under AAOIFI: 78% compliant. Under DJIM: 82% compliant. 2 stocks differ: [list with ratios]"

### AI Guardrails
- Never uses "you should", "I recommend", "consider buying/selling"
- Always attributes data to source: "Based on [AAOIFI screening data]..."
- Every response includes subtle footer: "Based on [source]. Not financial advice."
- Cannot generate future return projections
- Cannot compare specific stocks to recommend one over another

### Feature Classification

**Calculators (math, no opinions):**
- Gain/loss calculator
- Purification amount calculator
- Zakat estimator
- Savings projection (deposits only, zero return assumption)
- What-if calculator (user inputs both sides)

**Translators (complex to simple, no recommendations):**
- Sharia screening ratios to plain language
- Portfolio composition to visual treemap
- Performance data to contribution vs value
- AI explainer answering "what does this mean" questions

**Reporters (3rd party data, always attributed):**
- Screening status from [methodology source]
- Price data from [provider]
- Status change alerts (factual notifications)

---

### 9.4 Defense Against Free LLM Substitution

Users could copy portfolio data into a free LLM (ChatGPT, Gemini) to get similar answers. The app defends against this through context, convenience, and integration — not by trying to out-answer a general-purpose AI.

**Why users won't bother with a free LLM:**

| Factor | Your App | Free LLM Alternative |
|---|---|---|
| Context | AI already knows entire portfolio, cost basis, compliance ratios | User must manually type/paste every holding, every time |
| Speed | One tap → answer in 2 seconds | 5 steps, 3+ minutes of typing context |
| Accuracy | Grounded in real screening data + actual portfolio numbers | Hallucination risk on financial data |
| Integration | Answers wire into charts, treemap, export | Raw text, user must manually cross-reference |
| Proactive | Dashboard insights appear without asking | User must think of what to ask |
| Cost | ~$0.03 per query (1 credit) | Free, but costs 3 minutes of effort |

**Defense strategy — 6 layers:**

**1. Contextual, not generic.** Every AI response pulls from live portfolio data. The AI doesn't answer "Is Apple halal?" — it answers "Apple is 34% of YOUR portfolio, it's compliant, and here's how it affects YOUR compliance percentage." A free LLM can't do this without the user rebuilding context every session.

**2. One-tap convenience.** "Explain" button on every stock, every chart, every screening result. The friction of switching to a free LLM and typing context is worth more than $0.03.

**3. Visual integration.** AI responses aren't just text — they highlight holdings in the treemap, link to screening detail views, and offer PDF export. The AI is wired into the UI.

**4. Free proactive insights.** Give away some intelligence for free on the dashboard as pre-computed notifications:
- "Your compliance changed this week — STC moved to questionable"
- "You're up 6.2% this quarter. Deposits account for 4.1% of that."
- "Apple is now 40% of your portfolio"
These are rule-based (cheap, no LLM needed) but feel like AI intelligence. They train users to expect the app to "understand" them.

**5. Grounded accuracy.** Frame it in-app: "Answers are grounded in your portfolio data and [AAOIFI] screening ratios. Not generated from memory." This is a real advantage — free LLMs regularly hallucinate financial figures.

**6. Price the gap away.** At 1 credit ($0.03 actual cost to user) per query, the convenience always wins. The user's 3 minutes of typing context into ChatGPT is worth more than $0.03.

**The moat ranking:**
1. Contextual data (AI knows their portfolio) — strongest
2. One-tap convenience (no copy-paste, no explaining)
3. Visual integration (answers connect to charts/UI)
4. Free proactive insights (hooks them on "smart" app)
5. Grounded accuracy (no hallucinated numbers)
6. Low credit price (not worth switching to save $0.03)

---

## 10. Education Layer — Context + Content

The app educates through two complementary approaches: contextual learning embedded in the portfolio experience (personalized, dynamic) and a bundled content library (static, evergreen, written once).

### 10.1 Contextual Learning (Embedded in Portfolio)

Education triggered by the user's own data. Not a library — a teacher who knows your portfolio.

**Micro-lessons (? icon on every concept, free):**

Tiny explainers attached to every data point in the app. Written once (~30-40 total), concepts never change.

```
User sees: "Debt/Market Cap: 18.2% (limit: 33.33%)"
User taps "?" icon
Shows: "This ratio measures how much debt a company
        has relative to its value. Islamic scholars set
        a limit because excessive debt involves interest
        (riba). A lower ratio means the company relies
        less on interest-based borrowing.

        Your stock: 18.2% — well within the limit."
```

**Dashboard learning cards (rule-based, free):**

One rotating card on the dashboard based on portfolio state and user actions. No LLM needed — conditional logic.

```
Week 1 (user has 1 holding):
  "Investors typically hold 5-15 different investments
   to spread risk. You have 1."

Week 2 (user has 3 holdings, all tech):
  "Your holdings are all in technology. Different
   sectors react differently to market changes."

After first screening check:
  "You checked Apple's compliance. There are 3 main
   screening standards: AAOIFI, DJIM, and S&P Sharia.
   Each uses slightly different thresholds."
```

~20-30 cards total. Triggered by rules, not AI. Feels personalized. Actually just conditional logic with zero runtime cost.

**AI "Explain Simply" mode (paid, uses existing credit system):**

The LLM already handles this through portfolio explainer queries — no new feature needed, just system prompt tuning for beginner-friendly language.

### 10.2 Bundled Content Library — "Learn" Section

A static, evergreen library of ~25-30 articles bundled in the app binary. Written once, shipped forever. No CMS, no server, no API, no editorial calendar.

**Rules for content:**
- Evergreen only — concepts that don't change
- Bundled in app — ships with the binary, works offline
- Written once — no updates needed
- Localized once — Arabic + English at launch

**Content Structure:**

```
Learn (tab in bottom nav)
|
+-- Getting Started
|   +-- What is halal investing?
|   +-- Your first investment — what to know
|   +-- How to use this app
|
+-- Islamic Finance Basics
|   +-- Understanding riba (interest)
|   +-- What is gharar (uncertainty)?
|   +-- Maysir (gambling) in investments
|   +-- The role of Sharia scholars
|
+-- Screening Explained
|   +-- How Sharia screening works
|   +-- AAOIFI vs DJIM vs S&P — what's different?
|   +-- Debt ratio — why it matters
|   +-- Revenue screening — permissible vs non-permissible
|   +-- When stocks change compliance status
|
+-- Asset Types
|   +-- Stocks & ETFs
|   +-- Sukuk (Islamic bonds)
|   +-- Gold & commodities
|   +-- Crypto — the scholarly debate
|   +-- Real estate investments
|
+-- Portfolio Fundamentals
|   +-- What is diversification?
|   +-- Understanding risk vs return
|   +-- Reading your gains & losses
|   +-- What is a benchmark?
|   +-- Contribution vs actual profit
|
+-- Religious Obligations
|   +-- Purification — what, why, and how
|   +-- Zakat on investments
|   +-- Calculating your zakat
|
+-- Glossary
    +-- A-Z of investment & Islamic finance terms
```

**~25-30 articles. Each 400-600 words. Total ~15,000 words.**
Writing effort: 2-3 days focused, or 1 day LLM-assisted with personal review for accuracy.

**What content is NOT included (breaks the "write once" rule):**

| Excluded | Reason |
|---|---|
| "Best halal stocks in 2026" | Dated immediately |
| Market news or commentary | Requires updates |
| Specific stock analysis | Changes daily |
| Regulatory updates | Varies by country |
| "Our picks" or recommendations | Advisory territory — legal risk |

### 10.3 Content-to-Credit Bridge

Every article ends with a contextual action that connects learning to the paid tool:

```
Article: "How Sharia Screening Works"

  [...explanation of debt ratios, revenue screening...]

  +------------------------------------+
  | Check your portfolio                |
  | See which of your holdings pass    |
  | screening and which don't.         |
  |                                    |
  | [Check my portfolio — 2 credits]   |
  +------------------------------------+
```

```
Article: "Purification — What, Why, and How"

  [...explanation of purification concept...]

  +------------------------------------+
  | Calculate your purification         |
  | Get your exact purification amount |
  | based on your holdings.            |
  |                                    |
  | [Calculate — 2 credits]            |
  +------------------------------------+
```

```
Article: "What is Diversification?"

  [...explanation of diversification...]

  +------------------------------------+
  | Analyze your portfolio              |
  | See how diversified your holdings  |
  | are across sectors and asset types.|
  |                                    |
  | [Analyze — 2 credits]             |
  +------------------------------------+
```

The free user reads, learns, and when they're ready — the tool is one tap away. Education drives credit conversion through understanding, not pressure.

### 10.4 App Store & Acquisition Impact

| Factor | Effect |
|---|---|
| App Store keywords | Articles surface terms: "halal investing", "Sharia screening", "zakat calculator" |
| Store listing | "Includes complete Islamic finance learning library" — differentiator |
| Free user ratings | "I learned so much" — 5 star reviews from users who never paid |
| Session duration | Content increases time-in-app — App Store algorithm favors this |
| Word of mouth | "Download this app, it explains everything about halal investing" |
| Pre-investor audience | Users who haven't invested yet download, learn, then start investing inside the app |

### 10.5 Bottom Navigation — Updated

```
[ Dashboard ]  [ Portfolio ]  [ Learn ]  [ Settings ]
```

"Learn" earns a primary tab because it serves:
- **Acquisition** — free users exploring halal investing before they invest
- **Retention** — beginners building confidence through understanding
- **Conversion** — every article bridges to credit-based tools

### 10.6 Implementation

| Detail | Decision |
|---|---|
| Format | Markdown files bundled in app, rendered natively |
| Images | Minimal — use app's own chart components as inline illustrations |
| Writing | LLM-assisted first draft, personal review for Islamic finance accuracy |
| Localization | Arabic + English at launch |
| Location | "Learn" tab in bottom navigation |
| Updates | None planned. If needed, ship with app updates. No CMS. |
| Total effort | ~4-5 days (content writing + micro-lessons + learning cards) |
| Ongoing ops | Zero |

---

## 11. Disclaimer Strategy

**App-level (settings & onboarding):**
"This app is a visualization and calculation tool. It does not provide financial or religious advice. Sharia screening data is sourced from [provider] using [methodology]. Consult a qualified advisor for investment and religious decisions."

**Per AI response (subtle footer):**
"Based on [source]. Not financial advice."

**Per screening result:**
"Screened using [AAOIFI/DJIM] methodology. Scholars may differ on screening standards."

Short, honest, consistent. Visible where it matters, not buried.

---

## 12. Build Priority

### Pre-Build Validation (Before Writing Code — 1 week)
1. Validate EGX screening data accessibility — can you access financial statements publicly?
2. Research Egypt FRA stance on "visualization tool with third-party screening data"
3. Research Saudi CMA stance on Sharia classification — "screening results" vs "investment advice"
4. Identify EGX price data source (EODHD, EGX public data)
5. Manually screen 10-20 EGX stocks as proof-of-concept for the curation approach

### Phase 1 MVP — Egypt Market (Weeks 1-12)
1. Smart onboarding flow (Amira path + Khalid path)
2. Anonymous account (silent UUID creation)
3. Quick-Add Wizard (3-step entry) + CSV import
4. EGX price sync + offline cache (~220 stocks)
5. Manually curated Sharia screening data for EGX (AAOIFI thresholds)
6. Command Center (wealth chart, contribution vs value, treemap)
7. Per-holding list with gain/loss
8. Basic Sharia flag + compliance percentage
9. 20 welcome credits + credit purchase system
10. Micro-lessons (? icons on all concepts — ~30-40 static explainers)
11. Dashboard learning cards (rule-based, ~20-30 contextual tips)
12. Biometric lock
13. Dark mode
14. Arabic + English

### Phase 1.1 — Egypt Feature Expansion (Weeks 12-16)
15. Learn tab — bundled content library (~25-30 evergreen articles)
16. Content-to-credit bridges (CTAs at end of each article)
17. AI compliance explainer [credits]
18. AI portfolio analysis [credits]
19. Purification calculator + PDF export [credits]
20. Zakat calculator [credits]
21. Themes [credits]
22. Wealth Snapshot shareable card [credits]
23. Affiliate placements (Egyptian platforms + regional partners)

### Phase 2 — Saudi/GCC Expansion (Months 4-8)
24. Tadawul stock data + price sync (~200 stocks)
25. Manually curated Sharia screening for Tadawul
26. "Unlock All" lifetime purchase ($14.99) — prominent for Saudi users
27. AI stock screener [credits]
28. Dividend tracker [credits]
29. Multi-portfolio [credits]
30. Auto top-up option
31. Identified account opt-in (Sign in with Apple/Google for cloud backup)
32. Regulatory compliance adjustments based on CMA research (may need "community data" framing)

### Phase 3 — Malaysia/SEA Expansion (Months 8-12)
33. Bursa Malaysia stock data + price sync (~1,000 stocks)
34. Securities Commission Shariah-compliant list integration (free, published twice yearly)
35. Malay language support
36. Advanced screening methodology comparison (AAOIFI vs SC Malaysia vs DJIM) [credits]
37. What-if calculator [credits]
38. Benchmark comparison (DJIM, FTSE Shariah) [credits]
39. Glossary (A-Z investment + Islamic finance terms)

---

## 13. Monetization & Exit Strategy

### 13.1 Revenue Model — Two Streams

**Stream 1: Credit System (primary)**
- Freemium with in-app credit purchases
- Credits never expire — no subscription fatigue, no churn
- Regional pricing for developing markets (~50% discount)
- Pay-as-you-go aligns with prepaid culture in target markets

**Stream 2: Affiliate Commissions (secondary, pure margin)**
- Contextual partner placements where users have a natural next-step question
- Zero cost to operate — pure profit on top of credit revenue
- Clearly labeled, always dismissible, never inside screening data or AI responses
- See Section 13.8 for full affiliate strategy

### 13.2 Operational Cost Breakdown

#### Fixed Costs (Paid Regardless of User Count)

| Item | Cost | Frequency |
|---|---|---|
| Apple Developer Account | $99 | Annual |
| Google Play Developer | $25 | One-time |
| Domain + landing page | ~$15 | Annual |
| **Total fixed** | **~$140/year** | |

#### Market Data API Costs

| Provider | Free Tier | Paid Tier | Notes |
|---|---|---|---|
| Alpha Vantage | 25 req/day | $50/mo (75 req/min) | Reliable, good coverage |
| Twelve Data | 800 req/day | $29/mo (6K req/day) | Good value |
| Yahoo Finance (unofficial) | Free, unreliable | N/A | Not recommended for production |

Batch-syncing prices: 1 user with 20 holdings = 20 API calls per session.
At 1K daily active users = ~20K calls/day.

**Estimated cost: $29-50/month covers early stage.**

#### Sharia Screening Data Costs

| Approach | Cost | Coverage | Used In |
|---|---|---|---|
| Manual curation (EGX public financials + AAOIFI thresholds) | $0 (your time) | ~220 EGX stocks | Phase 1: Egypt |
| Manual curation (Tadawul public financials) | $0 (your time) | ~200 Tadawul stocks | Phase 2: Saudi |
| Malaysia Securities Commission Shariah list (free, published May + November) | $0 | ~1,000 Bursa Malaysia stocks | Phase 3: Malaysia |
| Musaffa API (if scaling beyond 3 markets) | ~$100-300/mo | Global, reliable, live | Future expansion |
| Zoya API (enterprise) | ~$1,000+/mo (unverified) | Global | Not recommended for indie budget |

**Strategy: Manual curation for Egypt + Saudi (~420 stocks combined), free government list for Malaysia. Total screening data cost: $0. Update quarterly using public financial statements. Upgrade to paid API only when expanding beyond 3 markets or when revenue justifies it.**

Total stocks to screen across all 3 markets: ~620. This is a manageable dataset — no expensive global API needed.

#### LLM API Costs — Largest Variable Cost

| Model | Input Cost (per 1M tokens) | Output Cost (per 1M tokens) | Typical Query Cost |
|---|---|---|---|
| Claude Haiku | ~$0.80 | ~$4.00 | ~$0.003/query |
| Claude Sonnet | ~$3.00 | ~$15.00 | ~$0.012/query |
| Claude Opus | ~$15.00 | ~$75.00 | ~$0.06/query |

Typical user query ("Is this stock halal? Explain why"):
- ~600 tokens in (system prompt + user question + stock data)
- ~400 tokens out (explanation)

**Strategy: Haiku for simple lookups, Sonnet for complex analysis. Never Opus.**
**Blended average: ~$0.005/query.**

#### Cost Per User Per Quarter

| User Type | AI Queries/Quarter | LLM Cost | Infra Share | Total Cost |
|---|---|---|---|---|
| Free user | 0 | $0 | ~$0 | **~$0** |
| Light premium (20 queries) | 20 | $0.10 | $0.05 | **~$0.15** |
| Active premium (100 queries) | 100 | $0.50 | $0.05 | **~$0.55** |
| Heavy premium (200+ queries) | 200+ | $1.00 | $0.05 | **~$1.05** |

#### Infrastructure Cost at Scale

| Monthly Active Users | Monthly Infra Cost | Per-User/Month |
|---|---|---|
| 1,000 | ~$50-80 | ~$0.06 |
| 5,000 | ~$100-150 | ~$0.03 |
| 10,000 | ~$150-300 | ~$0.02 |

### 13.3 Profitability Analysis

#### Per-Transaction Margins

Apple/Google take 30% cut on all in-app purchases (15% if under $1M/year via Small Business Program).

| Credit Package | User Pays | Store Cut (30%) | Net Revenue | Est. User Cost | Margin |
|---|---|---|---|---|---|
| Starter ($1.99) | $1.99 | $0.60 | $1.39 | ~$0.25 | **$1.14 (82%)** |
| Value ($4.99) | $4.99 | $1.50 | $3.49 | ~$0.75 | **$2.74 (78%)** |
| Power ($9.99) | $9.99 | $3.00 | $6.99 | ~$1.50 | **$5.49 (79%)** |

With Small Business Program (15% cut):

| Credit Package | User Pays | Store Cut (15%) | Net Revenue | Est. User Cost | Margin |
|---|---|---|---|---|---|
| Starter ($1.99) | $1.99 | $0.30 | $1.69 | ~$0.25 | **$1.44 (85%)** |
| Value ($4.99) | $4.99 | $0.75 | $4.24 | ~$0.75 | **$3.49 (82%)** |
| Power ($9.99) | $9.99 | $1.50 | $8.49 | ~$1.50 | **$6.99 (82%)** |

#### Per Credit Margin

| Package | Credits | Net Revenue (15% cut) | Cost to Serve All Credits | Profit Per Credit |
|---|---|---|---|---|
| Starter (50 credits) | 50 | $1.69 | $0.25 | **$0.029** |
| Value (150 credits) | 150 | $4.24 | $0.75 | **$0.023** |
| Power (400 credits) | 400 | $8.49 | $2.00 | **$0.016** |

Note: Feature unlocks (permanent, no recurring cost) are pure profit after the store cut. A user who spends 110 credits unlocking features costs $0 in ongoing API fees.

### 13.4 Revenue Projections (Market-Phased, Reality-Checked)

Note: These projections are based on market-separated analysis with validated conversion rates per region. Screening data cost is $0 for all three markets (manual curation for Egypt/Saudi, free government list for Malaysia).

#### Conservative Scenario (12 months — Egypt only, slow growth)

| Market | Downloads | MAU | Conversion | Paying Users | Avg Revenue/User | Revenue |
|---|---|---|---|---|---|---|
| Egypt (months 1-12) | 5,000 | 2,000 | 2.5% | 50 | $7.00 | $350 |
| Saudi (months 4-12) | 2,000 | 800 | 5% | 40 | $12.00 | $480 |
| **Credit revenue** | | | | | | **$830** |
| **Affiliate revenue** | | | | | | **$300** |
| **Total gross** | | | | | | **$1,130** |

| Costs (12 months) | Amount |
|---|---|
| Store cut (15%) | -$125 |
| Market data API | -$480 |
| LLM API | -$150 |
| Serverless infra | -$240 |
| **Net profit** | **$135** |

Barely break-even. But: 7K downloads + working product + any revenue = a flippable asset.

#### Moderate Scenario (12 months — Egypt + Saudi, steady growth)

| Market | Downloads | MAU | Conversion | Paying Users | Avg Revenue/User | Revenue |
|---|---|---|---|---|---|---|
| Egypt (months 1-12) | 8,000 | 3,200 | 2.5% | 80 | $7.00 | $560 |
| Saudi (months 4-12) | 4,000 | 1,600 | 5% | 80 | $14.00 | $1,120 |
| Malaysia (months 8-12) | 3,000 | 1,200 | 4% | 48 | $9.00 | $432 |
| **Credit revenue** | | | | | | **$2,112** |
| **Affiliate revenue** | | | | | | **$3,000** |
| **Total gross** | | | | | | **$5,112** |

| Costs (12 months) | Amount |
|---|---|
| Store cut (15%) | -$317 |
| Market data APIs (3 markets) | -$960 |
| LLM API | -$400 |
| Serverless infra | -$480 |
| **Net profit** | **$2,955** |
| **Net margin** | **58%** |

15K downloads across 3 markets. Modest but real revenue with healthy margins.

#### Optimistic Scenario (12 months — viral in Egypt, strong Saudi uptake)

| Market | Downloads | MAU | Conversion | Paying Users | Avg Revenue/User | Revenue |
|---|---|---|---|---|---|---|
| Egypt (months 1-12) | 20,000 | 8,000 | 3% | 240 | $8.00 | $1,920 |
| Saudi (months 4-12) | 10,000 | 4,000 | 6% | 240 | $16.00 | $3,840 |
| Malaysia (months 8-12) | 10,000 | 4,000 | 4% | 160 | $10.00 | $1,600 |
| **Credit revenue** | | | | | | **$7,360** |
| **Affiliate revenue** | | | | | | **$8,000** |
| **Total gross** | | | | | | **$15,360** |

| Costs (12 months) | Amount |
|---|---|
| Store cut (15%) | -$1,104 |
| Market data APIs | -$1,440 |
| LLM API | -$1,200 |
| Serverless infra | -$720 |
| Screening API upgrade (optional) | -$1,200 |
| **Net profit** | **$9,696** |
| **Net margin** | **63%** |

40K downloads, 3 proven markets, real revenue trajectory.

### 13.5 Why Credits Over Subscriptions

| Factor | Credits | Subscription |
|---|---|---|
| User psychology | "I buy when I need" — no commitment fear | "Am I using this enough?" — cancellation pressure |
| Developing markets | Aligns with prepaid/top-up culture (telecom model) | Recurring charges feel risky on limited budgets |
| Churn | No churn — credits sit until used | Quarterly churn is typically 15-25% for finance apps |
| For flip/acquisition | Credit balances = deferred revenue on books | Subscription metrics need 6+ months to prove stable |
| Revenue predictability | Less predictable, but each purchase is intentional | More predictable, but inflated by users who forgot to cancel |
| Trust | "Pay for what you use" matches privacy-first brand | Recurring charge feels like surveillance-era business model |

### 13.6 Exit Strategy

#### Potential Acquirers

| Acquirer Type | Examples | Why They'd Buy |
|---|---|---|
| Islamic fintechs | Wahed Invest, Musaffa, Zoya | Acqui-hire + tech, faster than building |
| Brokerage platforms | Expanding into MENA/SEA | Ready-made halal screening + visualization layer |
| Portfolio apps | Delta, Stock Events | Enter Islamic finance vertical |
| Islamic banks | Going digital | Consumer-facing investment tool |

#### What Makes This Flippable
- Zero/low server costs (offline-first architecture)
- High margins (66-82% depending on scale)
- Dual revenue streams (credits + affiliates) with proven conversion data
- Credit balances as deferred revenue
- Modular codebase, easy to extend
- Underserved niche validated by downloads and ratings
- LLM integration adds perceived tech value
- B2B licensing potential (screening + AI layer to Islamic banks)

#### Flip Timeline (Phased)

| Phase | Duration | Market | Goal |
|---|---|---|---|
| Pre-build validation | 1 week | — | Confirm data sources, regulatory stance |
| Build Egypt MVP | 10-12 weeks | Egypt | Core app + EGX screening + credits |
| Egypt launch & grow | 2-3 months | Egypt | 3-5K downloads, 4+ stars, prove credits |
| Saudi expansion | 2-3 months | Saudi/GCC | Add Tadawul, revenue engine, acquirer visibility |
| Malaysia expansion | 2-3 months | SEA | Scale play, prove multi-market |
| Approach buyers | Month 10-14 | All | With 3-market traction data |

#### Realistic Flip Valuation (Reality-Checked)

| Scenario | Revenue (12mo) | Downloads | Assets Beyond Revenue | Estimated Sale Price |
|---|---|---|---|---|
| Conservative | ~$1,130 | 7K | Clean codebase, screening data, content library, 2 markets | **$10K-25K** |
| Moderate | ~$5,112 | 15K | 3 proven markets, affiliate revenue, strong ratings | **$25K-75K** |
| Optimistic | ~$15,360 | 40K | Growth trajectory, strategic acquisition target | **$75K-200K** |

Note: At these revenue levels, the sale price is driven more by tech assets + user base + niche positioning than by revenue multiples. Strategic acquirers (Islamic fintechs wanting market access) pay premiums above marketplace rates. Direct outreach to acquirers consistently yields 2-3x vs listing on Acquire.com/Flippa.

#### Listing Channels
- Acquire.com (formerly MicroAcquire) — best for SaaS/app acquisitions
- Direct outreach to Islamic fintechs — highest premium, most effort
- Flippa — lower quality but wider reach

### 13.7 Break-Even Analysis

#### Phase 1 (Egypt only — minimal infrastructure)

| Item | Monthly Cost |
|---|---|
| Market data API (EODHD basic) | $20-40 |
| Serverless functions | $5-15 |
| LLM API (low volume) | $10-30 |
| **Total monthly burn** | **$35-85** |

To break even at $35/month minimum:
- Need ~10 Starter purchases/month ($1.69 net each = $16.90 × 2 = $33.80), OR
- Need ~8 Value purchases/month ($4.24 net × 8 = $33.92), OR
- Need ~30 paying users making 1 purchase/quarter

**Phase 1 break-even: ~1,000 MAU with 2.5% conversion.**

#### Phase 2 (Egypt + Saudi — two markets)

| Item | Monthly Cost |
|---|---|
| Market data APIs (2 markets) | $50-80 |
| Serverless functions | $15-30 |
| LLM API (growing volume) | $30-80 |
| **Total monthly burn** | **$95-190** |

**Phase 2 break-even: ~2,000 MAU with 3% conversion.** Saudi's higher ARPU makes this achievable — a few Saudi "Unlock All" purchases ($14.99) cover the monthly burn quickly.

#### Phase 3 (All three markets)

| Item | Monthly Cost |
|---|---|
| Market data APIs (3 markets) | $80-120 |
| Serverless functions | $20-40 |
| LLM API | $50-150 |
| Optional screening API | $0-100 |
| **Total monthly burn** | **$150-410** |

**Phase 3 break-even: ~4,000 MAU with 3.5% blended conversion.**

### 13.8 Affiliate Strategy

#### Principle: Connect, Don't Recommend

The app is a visualization tool. When users discover portfolio needs (non-compliant holdings, no diversification, want to start investing), the natural next question is "where do I act on this?" Affiliates answer that question as a utility — showing platforms, not pushing products.

#### Affiliate Partners

| Partner Type | Examples | Commission Model | Fit |
|---|---|---|---|
| Halal investment platforms | Wahed Invest, Sarwa, Fasset, Manzil | $10-50 per signup (CPA) | Strong — direct audience match |
| Halal robo-advisors | Wahed, Saturna Capital | Revenue share or CPA | Strong |
| Gold/commodity platforms | OneGold, BullionVault | Per transaction % | Good — gold popular with audience |
| Islamic banking apps | Regional digital banks | Per account opened | Moderate |
| Financial education courses | Halal investing courses (Udemy, Skillshare) | Revenue share per enrollment | Good — aligns with Learn tab |
| Zakat/charity organizations | Islamic Relief, National Zakat Foundation | Per donation referral | Good — natural after zakat calculation |

#### Placement — Contextual, Not Intrusive

Affiliates appear only where the user has a natural next-step question:

| Placement | Trigger | What User Sees |
|---|---|---|
| Screening detail (non-compliant stock) | User views a non-compliant holding | "Browse compliant stocks on [partner platforms]" |
| Learn tab articles (asset types) | User reads about sukuk, gold, etc. | "Open a halal investment account on [partner]" |
| After zakat calculation | User sees zakat amount | "Pay your zakat through [partner charity]" |
| Portfolio empty state | New user, no holdings yet | "Start investing with [partner platforms]" |
| After what-if rebalancing | User planned changes | "Execute trades on [partner]" |
| Learn tab (education courses) | User reads beginner content | "Deepen your knowledge with [course partner]" |

#### Trust Rules — Non-Negotiable

1. Always labeled "Partner" — never hidden
2. Always dismissible — user can hide affiliate cards permanently
3. Never more than one affiliate placement visible per screen
4. Never inside screening results, compliance data, or AI responses
5. Multiple partners shown, not exclusive deals
6. Affiliate relationships disclosed in Settings: "Some links are affiliate partnerships. We may earn a commission if you sign up. This does not affect screening results or any data shown in the app."

#### Revenue Projections (Affiliate Only)

| Metric | Conservative (6mo) | Moderate (12mo) | Optimistic (12mo) |
|---|---|---|---|
| Monthly active users | 4,000 | 12,000 | 40,000 |
| Users who see affiliate placement | 40% (1,600) | 40% (4,800) | 40% (16,000) |
| Click-through rate | 3% (48/mo) | 4% (192/mo) | 5% (800/mo) |
| Signup conversion | 10% (5/mo) | 12% (23/mo) | 12% (96/mo) |
| Avg CPA commission | $25 | $30 | $30+ |
| **Monthly affiliate revenue** | **$125** | **$690** | **$2,880+** |
| **Period total** | **$750** | **$8,280** | **$34,560+** |

Zero cost to serve. Pure margin on top of credit revenue.

---

## 14. Competitive Landscape (Reality-Checked, March 2026)

### Global Competitors

| Competitor | Status (2026) | Remaining Gap for Us |
|---|---|---|
| Zoya | Growing fast, $500M+ connected assets claimed, strong UX, expanding global coverage | US-centric audience, no Egypt/EGX focus, subscription model |
| Musaffa | AI-powered, 40-90 markets claimed, launched "Academy" for beginners | Data-heavy UX, not visualization-first, no narrative approach |
| Islamicly | Active, global screening | Screening-focused, not a portfolio visualizer |
| Portfolio Visualizer | Complex professional tool | Not for beginners, no Sharia layer |
| Kubera | Generic wealth tracker | No Sharia features, no developing market focus |
| Delta | Portfolio tracker | No Sharia screening, no narrative visualization |

### Regional Competitors (By Target Market)

| Market | Local Competition | Our Edge |
|---|---|---|
| Egypt | Minimal — no dominant halal portfolio app for EGX | First-mover, Arabic-first, offline-first for unreliable connectivity |
| Saudi/GCC | AEON-type digital banks adding screening, local brokerages (Derayah, SNB Capital) | Privacy-focused (not tied to a broker), visualization UX, cross-platform |
| Malaysia/SEA | AEON Bank, local trading apps adding Sharia features | Free SC Malaysia list integration, multi-market portfolio view, offline-first |

### Honest Assessment
Competitors are improving. Zoya and Musaffa have stronger data infrastructure and funding. Our edge is NOT screening data — it's **visualization UX + privacy + developing market focus + offline-first architecture + education layer**. If we try to compete on screening depth, we lose. We compete on clarity.

### Potential Acquirers (Market-Specific)

| Market | Acquirer Type | Examples | Motivation |
|---|---|---|---|
| Egypt | Super-apps, local fintechs | MNT-Halan, Fawry, ValU | Add wealth/investment layer to existing user base |
| Saudi/GCC | Digital banks, investment platforms | Derayah Financial, SNB Capital, Stc Pay, Hala | Consumer-facing halal investment tool |
| Malaysia/SEA | Islamic banks, super-apps, fintechs | AEON Bank, Wahed Invest (Malaysia ops), TH (Tabung Haji) | Digital investment tool for Muslim customers |
| Global (Islamic fintechs) | Sharia screening platforms | Musaffa, Zoya, Wahed Invest | Acqui-hire, user base, visualization layer |

---

## 15. Open Decisions (For Architecture Phase)

### Technical
- Tech stack: React Native vs Flutter (cross-platform required for Egypt Android-heavy market)
- Backend: Serverless functions vs Firebase vs Supabase (minimal — just credit validation + LLM proxy)
- Market data API: EODHD vs Twelve Data vs EGX public data for Phase 1
- LLM provider: Claude Haiku/Sonnet vs Jais (Arabic-first LLM by G42) vs hybrid
- Chart library: must perform well on mid-range Android devices common in Egypt

### Data
- EGX financial statement accessibility — confirm public access for screening curation
- Screening update frequency — quarterly refresh vs semi-annual
- Price data freshness — end-of-day vs delayed 15-min for free tier

### Business
- App name and branding
- Legal entity for App Store accounts
- Egypt FRA confirmation on "visualization tool" classification
- Saudi CMA research on Sharia classification framing ("screening data" vs "community data viewer")

### Pre-Build Validation Checklist (Must Complete Before Coding)
- [ ] Access 10 EGX stock financial statements and screen against AAOIFI thresholds
- [ ] Confirm EODHD or alternative covers EGX with acceptable pricing
- [ ] Email/inquiry to Egypt FRA on visualization tool classification
- [ ] Research Saudi CMA published guidance on fintech classification
- [ ] Test Claude Haiku Arabic response quality for Islamic finance terms
