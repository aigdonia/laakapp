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

## 11. Ad Monetization — Bridge Revenue Strategy & Pricing Deep Dive

### 11.1 Why Ads Are Being Considered

The affiliate strategy (Section 7) has structural weaknesses for Phase 1:

| Weakness | Detail |
|---|---|
| Most platforms have no public affiliate program | Only Thndr has a confirmed referral program — capped at 15 referrals/year |
| BD leverage at 2K MAU is zero | Solo dev with small user base can't negotiate partnership terms |
| CPA assumptions ($25-30) are unverified | No confirmed data for Egyptian platform CPAs |
| Conversion funnel is long | Impression → click → signup → fund account → payout. Months of delay |
| Affiliate revenue is a Phase 2/3 source at best | Not reliable for Phase 1 break-even |

Ads serve as **bridge revenue** — temporary, feature-flagged, designed to be replaced by affiliates and credit purchases at scale.

### 11.2 Ad Pricing Fundamentals

#### The Basic Unit: An Impression

One ad shown to one user = one impression. All ad pricing is math on top of this.

#### CPM (Cost Per Mille)

What an **advertiser pays** to show 1,000 impressions.

```
Advertiser says: "I'll pay $2 CPM"
Meaning: "I'll pay $2 for every 1,000 times my ad is shown"
One impression = $2 / 1,000 = $0.002
```

This is the advertiser's number. Visible in their dashboards (Meta Ads, Google Ads). As a publisher (us), we care about eCPM.

#### eCPM (Effective Cost Per Mille)

What **we actually earn** per 1,000 impressions. This is our number.

```
eCPM = (Total earnings / Total impressions) × 1,000
```

Why "effective"? Because we're not always paid per impression. Different ads pay differently:

| Ad Type | Advertiser Pays For | How eCPM Is Calculated |
|---|---|---|
| CPM ads | Impressions (showing the ad) | Direct — what they bid |
| CPC ads | Clicks only | Show 1,000 ads, 20 get clicked at $0.10 = $2.00 eCPM |
| CPI ads | App installs | Show 1,000 ads, 2 install at $1.50 = $3.00 eCPM |
| CPA ads | Actions (signup, purchase) | Show 1,000 ads, 1 signs up at $5 = $5.00 eCPM |

eCPM normalizes everything into one comparable number regardless of how the advertiser pays.

#### Real Example — Mixed Ad Types in a Day

```
Morning:  CPC ad shown 500 times, 10 clicks × $0.08  = $0.80
Midday:   CPM ad shown 300 times, pays $3 CPM         = $0.90
Evening:  CPI ad shown 200 times, 1 install × $2.00   = $2.00

Total: 1,000 impressions, $3.70 earned
eCPM = ($3.70 / 1,000) × 1,000 = $3.70
```

We never control the mix — the ad network's auction decides what fills each slot.

### 11.3 The Auction — How eCPM Is Determined

Every time the app requests an ad, this happens in ~100ms:

```
App requests ad
        ↓
Ad network runs real-time auction
        ↓
Advertiser A bids $1.50 CPM (wants brand awareness)
Advertiser B bids $0.12 CPC (wants clicks)
Advertiser C bids $2.00 CPI (wants installs)
        ↓
Network picks the highest expected revenue bid
        ↓
Ad is shown to user
        ↓
We get paid based on what happens (view, click, or install)
```

### 11.4 What Determines Our eCPM

Same ad format, wildly different eCPM depending on these factors:

#### Factor 1: Geography (Biggest Factor)

| Country | Banner eCPM | Interstitial eCPM | Rewarded Video eCPM |
|---|---|---|---|
| USA | $0.50-2.00 | $4-10 | $10-20 |
| Saudi Arabia | $0.30-1.00 | $2-6 | $5-12 |
| Malaysia | $0.20-0.80 | $1.50-4 | $3-8 |
| Egypt | $0.10-0.40 | $0.80-2 | $2-5 |
| Nigeria | $0.05-0.20 | $0.30-1 | $1-3 |

Egypt is 5-10x lower than US. This is why ad revenue is supplemental, not the business model.

#### Factor 2: Ad Format (Second Biggest)

Egypt-specific eCPM ranges:

```
Banner:           $0.10-0.40  ← garbage revenue
Interstitial:     $0.80-2.00  ← annoying, moderate revenue
Rewarded Video:   $2.00-5.00  ← best revenue, user-initiated
Native:           $0.50-1.50  ← if network-served
```

Rewarded video earns 10-20x more than banners.

#### Factor 3: User Engagement Signals

| Signal | Effect on eCPM |
|---|---|
| User watches full video (rewarded) | Higher — advertiser got full attention |
| User skips/closes quickly | Lower — network learns users don't engage |
| High click-through rate | Higher — users are valuable to advertisers |
| Finance app category | Higher — finance users are high-intent, advertisers pay more |
| Session length | Higher — more data for targeting, better ad relevance |

#### Factor 4: Fill Rate — The Hidden Killer

```
Fill rate = ads actually served / ads requested
```

Request 100 ads, network has ads for 70 of them = 70% fill rate. The other 30 show nothing, earn nothing.

In Egypt, fill rates can be 50-70% depending on the network. Always multiply by fill rate when projecting revenue:

```
Theoretical: 1,000 requests × $3 eCPM / 1,000 = $3.00
Actual:      1,000 requests × 70% fill × $3 eCPM / 1,000 = $2.10
```

### 11.5 ARPDAU (Average Revenue Per Daily Active User)

The primary metric for tracking ad revenue performance:

```
ARPDAU = Daily ad revenue / Daily active users
```

For context:
- Top finance apps: $0.05-0.15 ARPDAU
- Our projected ARPDAU (Egypt, rewarded-only): ~$0.003
- Low, but this is Egypt eCPMs + rewarded-only (small subset of users) — supplemental revenue, not the business model

### 11.6 Revenue Projection — Phase 1 Egypt (Rewarded Video Only)

```
2,000 MAU
× 30% opt into watching rewarded ads = 600 users
× 1.5 ads/day average = 900 impressions/day
× 70% fill rate = 630 filled impressions/day
× $3.00 eCPM / 1,000 = $1.89/day
× 30 days = ~$57/month
```

**$57/month covers most of Phase 1 burn ($35-85/month).** Not life-changing, but closes the gap that affiliates can't fill yet.

### 11.7 Ad Network Comparison for Our Case

| Network | Rewarded Video eCPM (Egypt) | Fill Rate (MENA) | Haram Filtering | Verdict |
|---|---|---|---|---|
| Google AdMob | $2-4 | 60-75% | Category blocks, imperfect | Best overall for MENA |
| Meta Audience Network | $2-5 | 40-60% | Weak filtering | Higher eCPM but lower fill, less control |
| Unity Ads | $3-6 | 30-50% | Gaming-focused, irrelevant ads | Bad fit for finance app |
| AppLovin/MAX (mediation) | Varies | 70-85% | Aggregates networks, better fill | Best fill rate via mediation |

**Mediation** — instead of using one network, a mediation layer (AppLovin MAX, AdMob mediation, ironSource) auctions each impression across multiple networks simultaneously and picks the highest bid. Improves both eCPM and fill rate. Worth setting up from day 1 if ads are implemented.

### 11.8 Ad Types — Fit Assessment for Laak

#### Acceptable (If Ever Introduced)

**1. Rewarded Video Ads (Best Fit — Bridge Revenue Workhorse)**
- User taps "Watch ad for 2 credits" when credits run out
- User-initiated — preserves "calm, clear, no pressure" identity
- Best eCPM format ($2-5 in Egypt)
- Keeps users in the credit ecosystem — they earn credits, not just eyeballs
- Great for Egypt/SEA users who won't pay but will trade attention

**2. Native Content Cards**
- Looks like existing dashboard learning cards or affiliate placements
- "Sponsored insight" or "Partner spotlight" — single card, dismissible, clearly labeled
- We control the content, format, and placement
- Fits progressive disclosure pattern — doesn't break the visual language
- Example: a Bokra or Thndr branded card in the Learn tab

**3. Sponsored Articles in Learn Tab**
- Partner-written article alongside evergreen content
- "Sponsored by Bokra: Understanding Sukuk investing"
- Educational, on-brand, high CPM (content marketing, not display ads)
- We vet it before it ships — zero haram risk

#### Never Introduce

**1. Banner Ads**
- Destroys "calm, clear" visual identity
- Lowest CPMs ($0.10-0.40 in Egypt), highest trust erosion
- Screams "cheap app" — kills credibility with Saudi/GCC premium users

**2. Interstitial / Full-Screen Ads**
- A financial app showing full-screen ads between portfolio views = uninstalls
- Especially toxic after a screening result or zakat calculation — sacred context interrupted by noise

**3. Programmatic Display (AdMob Display, Meta Audience Network banners)**
- Lose content control entirely — haram ads will slip through
- Alcohol, conventional banking, gambling ads will appear. Ad network filtering is unreliable
- One screenshot of a Heineken ad in a Sharia compliance app goes viral and the brand is destroyed
- MENA users are vocal about this — it has happened to other Islamic apps

**4. Pre-Roll Video (Forced)**
- Same problem as interstitials but worse — user is trapped
- Contradicts "no pressure" and "nothing breaks when credits run out"

**5. Notification / Push Ads**
- Instant uninstall trigger, especially in finance apps
- App Store review policy violation risk

### 11.9 Haram Content Safeguards — Non-Negotiable

If any ad network is used, these safeguards are mandatory:

| Safeguard | Why |
|---|---|
| Whitelist-only advertisers | Blacklists leak — must approve every advertiser |
| No programmatic bidding for display | RTB = zero control over what shows up |
| Manual review pipeline | Every creative reviewed before it runs |
| Category blocks are insufficient | "Financial services" category includes conventional banks with riba products |
| Regional content review | An ad fine in Malaysia might be haram in Saudi context |

This is why native content cards and sponsored articles are the only formats with **full editorial control**. Rewarded video is acceptable because it's user-initiated (opt-in changes the dynamic).

### 11.10 Feature Flag Structure

```
ads.rewarded_video: true       // Phase 1 bridge revenue
ads.native_card: true          // Manual placement, our content
ads.banner: false              // Never
ads.interstitial: false        // Never
ads.show_after_days: 7         // 1-week grace period
ads.hide_above_credits: 0      // No credit threshold — rewarded is opt-in, self-selects
```

No credit-balance threshold needed. If ads are opt-in (rewarded), users with credits won't bother watching. Users without credits will. It self-selects naturally.

### 11.11 Revenue Stack by Phase

| Phase | Primary Revenue | Bridge Revenue (Ads) | Future Revenue |
|---|---|---|---|
| Phase 1 (Egypt) | Credits | Rewarded video + 1 native card | Affiliates (prospecting) |
| Phase 2 (Saudi) | Credits + "Unlock All" | Native cards only (no cheap ads for premium market) | Affiliates (leverage from downloads) |
| Phase 3 (scale) | Credits | Affiliates replace ads | Ads removed or kept only for zero-credit users |

### 11.12 Key Questions to Validate

| Assumption | Verify Against |
|---|---|
| Egypt rewarded video eCPM $2-5 | AdMob benchmarks, developer forums for MENA |
| 70% fill rate in Egypt | AdMob mediation reports, test with real traffic |
| 30% of free users opt into rewarded ads | Industry benchmarks for finance apps (gaming apps see 40-60%, finance likely lower) |
| AdMob category filtering blocks haram content reliably | Test with real ad requests in Egypt — monitor what actually serves |
| Rewarded video doesn't hurt App Store ratings | Monitor reviews post-launch, A/B test with feature flag |
| Mediation (AppLovin MAX) improves eCPM + fill rate over single network | Compare after 1 month of data with AdMob alone vs mediation |

---

## Instructions for Reviewer

Please validate each section against current market data. For each assumption:
1. **Confirm or deny** with source
2. **Provide the actual number** if our assumption is wrong
3. **Flag any critical risks** we haven't considered
4. **Suggest alternatives** where our approach is flawed

Focus especially on Section 10 — the top 10 assumptions. If any of those are fundamentally wrong, the entire project needs to pivot.
