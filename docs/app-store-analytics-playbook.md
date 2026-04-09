# Laak — App Store Analytics Playbook

> Three analytics layers working together: Apple (discovery), PostHog (behavior), RevenueCat (revenue).

---

## Setup Checklist

- [ ] **App Analytics**: Verify enabled in App Store Connect > Analytics (should be on by default)
- [ ] **PostHog**: Already configured (`src/lib/posthog.tsx`) — verify events firing in PostHog dashboard
- [ ] **RevenueCat**: Already configured — verify dashboard shows app and entitlements
- [ ] **Baseline snapshot**: Record Week 1 numbers as the baseline everything is measured against

---

## The Three Layers

| Layer | Tool | Covers | Key Question |
|---|---|---|---|
| **Discovery** | Apple App Analytics | Impressions > views > downloads | "Are people finding and installing us?" |
| **Behavior** | PostHog | Onboarding > features > retention | "Are people using the app and coming back?" |
| **Revenue** | RevenueCat | Credits > purchases > LTV | "Are people paying and is it sustainable?" |

---

## Layer 1: Apple App Analytics (Discovery Funnel)

### Key Metrics

| Metric | What It Tells You | Where to Find |
|---|---|---|
| **Impressions** | How often your app appeared in search/browse | App Analytics > Metrics |
| **Product Page Views** | How many tapped to see your listing | App Analytics > Metrics |
| **Conversion Rate** | Views that became downloads (target: >30% for niche) | Calculated: Downloads / Product Page Views |
| **App Units** | Total first-time downloads | App Analytics > Metrics |
| **Search Terms** | What people searched to find you | App Analytics > Sources > Search Terms |
| **Source Type** | Where downloads came from (Search, Browse, Referral) | App Analytics > Sources |

### What to Watch For

- **Low impressions, any conversion**: ASO keywords aren't matching searches. Revisit keyword field.
- **High impressions, low views**: App icon or name isn't compelling in search results.
- **High views, low downloads**: Product page isn't converting — check screenshots, description, ratings.
- **Search terms you didn't expect**: Goldmine — add these to your keyword strategy.
- **Search terms missing**: Terms you targeted but don't appear — they may have zero volume.

---

## Layer 2: PostHog (Behavior Funnel)

### Already Tracking (verify these fire)

| Event | Source | Purpose |
|---|---|---|
| Screen views | Autocapture | Which screens get visited, drop-off points |
| Currency picker | Custom event | Market preference signal |
| Language picker | Custom event | Localization priority signal |
| Screening rules | Custom event | Feature engagement |
| Theme toggle | Custom event | UX preference |
| Lock settings | Custom event | Privacy feature adoption |
| Stock analysis | Custom event | Core feature usage |
| Deep analysis | Custom event | Premium feature usage (credit-consuming) |

### Key Metrics to Define

| Metric | Definition | Target (Month 1) |
|---|---|---|
| **Day 1 Retention** | % users returning day after first open | >40% |
| **Day 7 Retention** | % users returning 7 days after first open | >20% |
| **Day 30 Retention** | % users returning 30 days after first open | >10% |
| **Onboarding Completion** | % completing onboarding flow | >70% |
| **First Stock Added** | % who add at least one stock | >50% |
| **First Analysis Run** | % who run at least one AI analysis | >20% |
| **Feature Adoption** | % using biometric lock | Track (no target) |

### Funnels to Build in PostHog

**Core Activation Funnel:**
```
App Open > Onboarding Complete > First Stock Added > First Analysis > First Credit Purchase
```

**Retention Cohort:**
```
Group by: first_open_date
Measure: any_event at Day 1, 7, 14, 30
```

---

## Layer 3: RevenueCat (Revenue)

### Key Metrics

| Metric | What It Tells You | Target (Month 1) |
|---|---|---|
| **Credit Purchase Rate** | % of active users who buy credits | >3% |
| **Average Revenue Per User (ARPU)** | Total revenue / total users | Baseline |
| **Revenue Per Paying User** | Total revenue / paying users | Baseline |
| **First Purchase Timing** | Days from install to first purchase | Track |
| **Repeat Purchase Rate** | % of buyers who buy again | >30% |

### RevenueCat Dashboard Checks

- Verify "LAK" virtual currency shows in dashboard
- Check offering configuration (dev vs prod keys)
- Monitor trial/introductory offer performance (if applicable)

---

## Weekly Review Template

> Every Monday morning. 15 minutes. Copy this into a note and fill in.

```
## Week of [DATE]

### Discovery (Apple Analytics)
- Impressions: ___
- Product Page Views: ___
- Conversion Rate: ___%
- App Units (new downloads): ___
- Top 3 search terms: ___, ___, ___
- Top source type: ___

### Behavior (PostHog)
- DAU (daily active users, avg): ___
- Day 1 Retention: ___%
- Day 7 Retention: ___%
- Onboarding completion: ___%
- Stocks added (total): ___
- AI analyses run (total): ___

### Revenue (RevenueCat)
- Total revenue: $___
- New paying users: ___
- Credit purchases: ___
- ARPU: $___

### Observations
- What's working:
- What's not:
- Action items for this week:
```

---

## Decision Triggers

These are signals that require action — not just observation.

| Signal | Meaning | Action |
|---|---|---|
| Conversion rate <20% | Product page isn't compelling | A/B test screenshots or description |
| Day 1 retention <30% | Onboarding or first experience failing | Review onboarding flow, check crash reports |
| Day 7 retention <10% | App isn't sticky enough | Add engagement hooks (notifications, insights) |
| 0 credit purchases in 2 weeks | Pricing or value proposition issue | Review credit pricing, check if analysis feels valuable |
| Top search term is unexpected | Organic opportunity | Lean into it — update keywords, description |
| Impressions dropping week-over-week | Losing search relevance | Refresh keywords, submit update |
| High analysis runs, low purchases | Credit pricing too high or free tier too generous | Review credit economy |

---

## Monthly Deep Dive (30 min)

On the first Monday of each month, go deeper:

1. **Cohort analysis**: Are newer users retaining better than early users? (improving = good)
2. **Search term evolution**: New terms appearing? Old ones declining?
3. **Geographic breakdown**: Which markets are growing? (Apple Analytics > Metrics > filter by territory)
4. **Feature correlation**: Do users who use [feature X] retain better? (PostHog)
5. **Revenue per market**: Is Egypt converting differently from US? (RevenueCat + PostHog)

---

## Tools Quick Reference

| Tool | URL | What to Check |
|---|---|---|
| App Store Connect | appstoreconnect.apple.com | App Analytics, ratings, reviews |
| PostHog | us.posthog.com | Behavior, retention, funnels |
| RevenueCat | app.revenuecat.com | Revenue, subscriptions, offerings |
