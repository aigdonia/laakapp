# Halal Wealth Visualizer — Reality Check Document

> This document extracts all claims, assumptions, and projections from the product direction document for independent validation against real market data. Every number and assumption below needs verification.

---

## 1. Market Size Claims — Verify These

| Claim | Source Needed |
|---|---|
| ~1.9 billion Muslims globally | UN/Pew Research population data |
| Islamic finance is a $4+ trillion industry | ICD-LSEG Islamic Finance Development Report or similar |
| Islamic finance growing at ~10% annually | Same source — verify current growth rate |
| Young, mobile-first populations in MENA/SEA/Africa | Mobile penetration data by region |
| No dominant consumer app owns halal portfolio tracking space | App Store/Play Store research |

**Key question: What is the actual addressable market for a halal portfolio visualization app? $4T is the total Islamic finance industry — what fraction cares about consumer portfolio tools?**

---

## 2. Competitor Claims — Verify These

We claim these are the competitors and their gaps:

| Competitor | Our Claimed Gap | Verify |
|---|---|---|
| Musaffa | "Screening-focused, weak portfolio visualization" | Check Musaffa's current features, ratings, download count |
| Zoya | "US-centric, limited developing market support" | Check Zoya's market coverage, recent updates |
| Portfolio Visualizer | "Too complex for beginners" | Check their UX, target audience |
| Kubera | "Generic, no Sharia layer" | Confirm no Islamic finance features |
| Delta | "No Sharia screening, no narrative visualization" | Check current features |
| Yahoo Finance | "No Sharia, no privacy, ad-heavy" | Confirm |

**Key questions:**
- What are Musaffa and Zoya's actual download numbers and ratings?
- What funding have Musaffa and Zoya raised? What's their current feature set?
- Are there competitors we missed? Check: Islamicly, Halal Investors, Funds@Work Sharia screener
- Has any major app (Delta, Kubera, etc.) added Sharia features since our last check?

---

## 3. Monetization Assumptions — Verify These

### Credit System Economics

| Assumption | Value | Verify Against |
|---|---|---|
| 5% free-to-paid conversion rate (conservative) | Industry benchmarks for finance apps |
| 7% conversion rate (moderate) | Same — is this realistic for developing markets? |
| 8% conversion rate (optimistic) | Same |
| $1.99-$9.99 price range for credit packs | Competitor pricing in target markets |
| Regional pricing at ~50% discount for developing markets | App Store regional pricing data, purchasing power parity |
| Credits never expire — no churn | Compare to other credit-based app models |

**Key questions:**
- What is the average conversion rate for freemium finance apps globally?
- What is the conversion rate specifically in MENA/SEA/Africa markets?
- What price points work in Egypt, Saudi Arabia, Malaysia, Nigeria, Indonesia?
- Are there successful apps using credit-based (not subscription) monetization in these markets? What are their conversion rates?

### Apple/Google Store Economics

| Assumption | Value | Verify |
|---|---|---|
| Apple/Google take 30% cut | Standard rate — correct? |
| Small Business Program reduces to 15% | Still active in 2026? Eligibility requirements? |
| In-app purchase (consumable credits) supported | Any restrictions on credit-based IAP models? |

---

## 4. Cost Assumptions — Verify These

### Market Data APIs (March 2026 pricing)

| Provider | Our Assumed Free Tier | Our Assumed Paid Tier | Verify Current Pricing |
|---|---|---|---|
| Alpha Vantage | 25 req/day | $50/mo for 75 req/min | Check alphavantage.co current plans |
| Twelve Data | 800 req/day | $29/mo for 6K req/day | Check twelvedata.com current plans |
| Yahoo Finance | Free, unreliable | N/A | Still available? Any changes? |

**Key questions:**
- Do these APIs cover MENA/SEA/African stock exchanges? (Tadawul, ADX, EGX, Bursa Malaysia, NSE Nigeria)
- What API provides the best coverage for developing market exchanges?
- Are there better alternatives we missed?

### Sharia Screening Data

| Provider | Our Assumed Cost | Verify |
|---|---|---|
| Musaffa API | ~$100-300/mo | Does Musaffa offer a public API? What's actual pricing? |
| IslamiclyHQ | Varies | Do they have an API? Pricing? |
| Cached/scraped dataset | $0 | Is freely available screening data accurate enough? What sources exist? |

**Key questions:**
- What Sharia screening data sources actually exist for developers?
- What is the cost of AAOIFI/DJIM screening data access?
- Can screening data for top 2000 stocks be legally cached and bundled in an app?
- How frequently does screening status change? (Weekly? Monthly? Quarterly?)

### LLM API Costs (March 2026 pricing)

| Model | Our Assumed Input Cost | Our Assumed Output Cost | Verify |
|---|---|---|---|
| Claude Haiku | ~$0.80/M tokens | ~$4.00/M tokens | Check anthropic.com/pricing |
| Claude Sonnet | ~$3.00/M tokens | ~$15.00/M tokens | Same |
| Claude Opus | ~$15.00/M tokens | ~$75.00/M tokens | Same |

**Key questions:**
- Are these prices current?
- Are there cheaper alternatives (Gemini Flash, GPT-4o-mini, Llama hosted) that could reduce costs?
- What is the realistic token count for a finance query with portfolio context? We assumed ~600 in + ~400 out — verify with sample prompts.

---

## 5. Revenue Projections — Stress Test These

### Conservative (6 months)

| Metric | Our Projection | Reality Check |
|---|---|---|
| 10K downloads in 6 months | Is this realistic for a niche app with no paid UA budget? |
| 4K MAU from 10K downloads | 40% retention — realistic for finance apps? |
| 5% conversion (500 paying) | See conversion benchmarks above |
| $3.50 avg purchase | Weighted by regional pricing, is this realistic? |
| 2.5 purchases per user in 6 months | How often do credit-based app users repurchase? |
| $750 affiliate revenue in 6 months | 5 signups/month × $25 CPA — are halal platform CPAs really $25? |
| **Total: $5,125 gross, $3,389 net** | |

### Moderate (12 months)

| Metric | Our Projection | Reality Check |
|---|---|---|
| 30K downloads in 12 months | Requires organic growth + marketing — realistic? |
| 12K MAU | 40% retention at scale |
| 7% conversion (2,100 paying) | Higher conversion assumes good reviews — verify |
| $4.00 avg purchase | |
| 3.5 purchases per user in 12 months | |
| $8,280 affiliate revenue | 23 signups/month × $30 CPA |
| **Total: $37,680 gross, $26,470 net** | |

### Optimistic (12 months)

| Metric | Our Projection | Reality Check |
|---|---|---|
| 100K downloads | Requires viral moments or paid UA — realistic without marketing budget? |
| 40K MAU | |
| 8% conversion (8,000 paying) | |
| $4.50 avg purchase | |
| 4 purchases per user in 12 months | |
| $36,000 affiliate revenue | 96 signups/month × $30 CPA |
| **Total: $180,000 gross, $139,600 net** | |

**Key questions:**
- What download numbers do similar niche apps (Musaffa, Zoya, Islamicly) actually achieve?
- What are realistic organic download numbers for a new finance app with no marketing budget?
- What is the typical MAU/download ratio for finance apps in developing markets?
- What repurchase frequency do credit-based apps actually see?

---

## 6. Flip/Exit Valuation — Verify These

### Our Claimed Multiples

| Scenario | Revenue | Multiple | Sale Price |
|---|---|---|---|
| Conservative | $5,125 | 5-8x + tech premium | $30K-55K |
| Moderate | $37,680 | 4-6x + tech premium | $100K-225K |
| Optimistic | $180,000 | 3-5x | $250K-600K+ |

**Key questions:**
- What are actual revenue multiples for mobile app acquisitions in 2025-2026?
- What are multiples specifically for niche/Islamic finance apps?
- What do apps actually sell for on Acquire.com and Flippa in this category?
- Search for real acquisition data: micro-SaaS and app flip sale prices by revenue range
- Is "tech premium" a real thing buyers pay, or are we inflating?

### Acquirer Validation

| Claimed Acquirer | Verify |
|---|---|
| Wahed Invest | Have they made acquisitions before? Current funding status? |
| Musaffa | Would they buy a competitor or build? Funding status? |
| Zoya | Same |
| Islamic banks "going digital" | Are Islamic banks actually acquiring consumer fintech apps? Examples? |
| Brokerage platforms expanding to MENA/SEA | Any evidence of this happening? |

**Key questions:**
- Has any Islamic fintech acquired a consumer app in the last 2 years?
- What is the typical acquisition pattern in Islamic fintech — build vs buy?
- Are Acquire.com and Flippa viable channels for this type of niche app?

---

## 7. Affiliate Revenue Assumptions — Verify These

| Assumption | Value | Verify |
|---|---|---|
| Halal investment platform CPA | $10-50 per signup | Check Wahed, Sarwa, Fasset affiliate programs — do they exist? What do they pay? |
| 3-5% click-through rate on contextual placements | Finance app industry benchmarks |
| 10-12% signup conversion from clicks | Standard for finance affiliate funnels? |
| Zakat charity referral commissions | Do Islamic charities have affiliate programs? |
| Education course affiliate revenue share | Udemy/Skillshare affiliate rates for finance content |

**Key questions:**
- Do Wahed Invest, Sarwa, or Fasset actually have affiliate programs?
- What CPA do halal investment platforms actually pay?
- What are affiliate conversion rates in the Islamic finance space specifically?

---

## 8. Technical Feasibility — Verify These

| Assumption | Verify |
|---|---|
| Can bundle Sharia screening data for 2000 stocks in-app | Data source legality, file size impact on app binary |
| SQLite handles portfolio data + price cache efficiently on mobile | Performance benchmarks for mobile SQLite with financial data |
| LLM API latency acceptable for in-app use (target <3 seconds) | Test Claude Haiku response time with finance prompts |
| Offline-first with sync works for price data | Stale data tolerance — how old can prices be before users complain? |
| React Native or Flutter can render treemap + area charts performantly | Chart library availability and performance on mid-range Android devices common in developing markets |
| App binary size stays reasonable with bundled content + screening data | Target <50MB for developing markets (slow downloads) |

---

## 9. Regulatory/Legal — Verify These

| Claim | Verify |
|---|---|
| "Visualization tool" avoids financial advisor regulation | Check financial regulations in: UAE, Saudi Arabia, Malaysia, Egypt, Nigeria, Indonesia, US, UK |
| Disclaimer is sufficient legal protection | What disclaimers do Musaffa/Zoya use? Any legal precedent? |
| Sharia screening reporting (not advising) is legally safe | Any cases where screening tools faced regulatory action? |
| Affiliate links don't trigger financial promotion regulations | UK FCA, US SEC, Saudi CMA rules on financial promotions in apps |
| Can operate globally from a single entity | Do any target markets require local licensing for financial apps? |

---

## 10. Summary — Top 10 Assumptions That Could Break This

Ranked by impact if proven wrong:

| # | Assumption | If Wrong |
|---|---|---|
| 1 | Sharia screening data is accessible and affordable for indie developers | No screening = no core differentiator |
| 2 | 5-10K organic downloads achievable without marketing budget | No users = no revenue = no flip |
| 3 | 5%+ free-to-paid conversion in developing markets | Revenue projections collapse |
| 4 | Market data APIs cover MENA/SEA/African exchanges | App doesn't serve target market |
| 5 | Credit-based monetization works in target markets | Entire revenue model fails |
| 6 | Islamic fintechs are willing to acquire consumer apps | No buyer for the flip |
| 7 | "Visualization tool" stays outside financial regulation | Legal risk in target markets |
| 8 | App Store allows credit-based IAP model as designed | Revenue mechanism blocked |
| 9 | LLM costs stay at current levels or decrease | Margins could compress |
| 10 | Solo developer can ship MVP in 6-8 weeks | Timeline slips = delayed revenue = delayed flip |

---

## Instructions for Reviewer

Please validate each section against current market data. For each assumption:
1. **Confirm or deny** with source
2. **Provide the actual number** if our assumption is wrong
3. **Flag any critical risks** we haven't considered
4. **Suggest alternatives** where our approach is flawed

Focus especially on Section 10 — the top 10 assumptions. If any of those are fundamentally wrong, the entire project needs to pivot.
