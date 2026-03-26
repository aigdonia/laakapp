# Revenue & Pricing Analysis

> Baseline analysis for credit-based IAP pricing — March 2026
> Compare against this as real data comes in.

---

## 1. Product Lineup (5 Products)

| Product | Credits | Price | Per-Credit | Savings vs Micro |
|---|---|---|---|---|
| `credits_micro` | 10 | $0.99 | $0.099 | — |
| `credits_starter` | 50 | $3.99 | $0.080 | 19% |
| `credits_value` | 150 | $7.99 | $0.053 | 46% |
| `credits_power` | 400 | $14.99 | $0.037 | 62% |
| `unlock_all_lifetime` | all features | $19.99 | — | — |

**Regional pricing:** Same prices globally. `credits_micro` at $0.99 serves as the Egypt-friendly entry point. Regional adjustments deferred until credit card adoption gap is addressed (Vodafone Cash, Fawry, etc.).

**Labels:** "Best Value" on `credits_value`.

---

## 2. Per-Product Margins

Using 15% store cut (Apple/Google Small Business Program, under $1M/year revenue).

**LLM cost assumptions:**
- Blended LLM cost per AI query: ~$0.005 (Haiku for simple, Sonnet for complex)
- ~60% of credits spent on AI queries, ~40% on feature unlocks ($0 marginal cost)
- Blended cost per credit consumed: ~$0.003

| Product | Price | Store Cut (15%) | Net Revenue | Serving Cost | Profit | Margin |
|---|---|---|---|---|---|---|
| `credits_micro` (10) | $0.99 | $0.15 | $0.84 | $0.03 | **$0.81** | **82%** |
| `credits_starter` (50) | $3.99 | $0.60 | $3.39 | $0.15 | **$3.24** | **81%** |
| `credits_value` (150) | $7.99 | $1.20 | $6.79 | $0.45 | **$6.34** | **79%** |
| `credits_power` (400) | $14.99 | $2.25 | $12.74 | $1.20 | **$11.54** | **77%** |
| `unlock_all_lifetime` | $19.99 | $3.00 | $16.99 | $0.00 | **$16.99** | **85%** |

---

## 3. Operational Cost Breakdown

### Fixed Costs

| Item | Cost | Frequency |
|---|---|---|
| Apple Developer Account | $99 | Annual |
| Google Play Developer | $25 | One-time |
| Domain + landing page | ~$15 | Annual |
| **Total fixed** | **~$140/year** | |

### Variable Costs (Per Phase)

| Phase | Market Data API | LLM API | Infra | Monthly Burn |
|---|---|---|---|---|
| Egypt only | $40/mo | $15-30/mo | $20/mo | **~$60/mo** |
| Egypt + Saudi | $70/mo | $30-50/mo | $30/mo | **~$140/mo** |
| All 3 markets | $120/mo | $50-100/mo | $40-60/mo | **~$280/mo** |

---

## 4. Revenue Projections (12 Months)

### Conservative — Egypt Only, Slow Growth

| Metric | Value |
|---|---|
| Downloads | 5,000 |
| MAU | 2,000 |
| Conversion | 2.5% (50 paying users) |
| Purchase mix | 60% micro/starter, 30% value, 10% power |

| Revenue | Amount |
|---|---|
| 30 × micro/starter @ avg $2.49 | $74.70/mo |
| 15 × value @ $7.99 | $119.85/mo |
| 5 × power @ $14.99 | $74.95/mo |
| **Monthly credit revenue** | **$269.50** |
| **Annual credit revenue** | **$3,234** |

| Annual Costs | Amount |
|---|---|
| Store cut (15%) | -$485 |
| Market data API | -$480 |
| LLM API | -$200 |
| Infra | -$240 |
| **Total costs** | **-$1,405** |
| **Net profit** | **$1,829** |
| **Net margin** | **57%** |

### Moderate — Egypt + Saudi + Malaysia, Steady Growth

| Market | Paying Users | Avg Revenue/User | Revenue |
|---|---|---|---|
| Egypt (12mo) | 80 | $9.00 | $720 |
| Saudi (8mo) | 80 | $18.00 | $1,440 |
| Malaysia (4mo) | 48 | $12.00 | $576 |
| **Credit revenue** | | | **$2,736** |
| **Affiliate revenue** | | | **$3,000** |
| **Total gross** | | | **$5,736** |

| Annual Costs | Amount |
|---|---|
| Store cut (15%) | -$410 |
| Market data APIs | -$960 |
| LLM API | -$450 |
| Infra | -$480 |
| **Total costs** | **-$2,300** |
| **Net profit** | **$3,436** |
| **Net margin** | **60%** |

### Optimistic — Viral Egypt, Strong Saudi Uptake

| Market | Paying Users | Avg Revenue/User | Revenue |
|---|---|---|---|
| Egypt (12mo) | 240 | $10.00 | $2,400 |
| Saudi (8mo) | 240 | $20.00 | $4,800 |
| Malaysia (4mo) | 160 | $13.00 | $2,080 |
| **Credit revenue** | | | **$9,280** |
| **Affiliate revenue** | | | **$8,000** |
| **Total gross** | | | **$17,280** |

| Annual Costs | Amount |
|---|---|
| Store cut (15%) | -$1,392 |
| Market data APIs | -$1,440 |
| LLM API | -$1,500 |
| Infra | -$720 |
| Screening API upgrade | -$1,200 |
| **Total costs** | **-$6,252** |
| **Net profit** | **$11,028** |
| **Net margin** | **64%** |

---

## 5. Break-Even Analysis

| Phase | Monthly Burn | Break-Even Point |
|---|---|---|
| Egypt only | ~$60/mo | ~8 value packs/mo or ~15 starter packs/mo |
| Egypt + Saudi | ~$140/mo | ~18 value packs/mo (~1,500 MAU at 2.5%) |
| All 3 markets | ~$280/mo | ~35 value packs/mo (~3,000 MAU at 3%) |

---

## 6. Competitive Context

All direct competitors use subscription-only models:

| App | Monthly | Annual | Model |
|---|---|---|---|
| Zoya | ~$8.99 | ~$59.99 | Subscription |
| Musaffa | ~$11.99 | ~$83.99 | Subscription |
| Islamicly | Tiered | Localized | Subscription |
| **Laak** | **$0.99-$14.99** | **—** | **Credits (pay-as-you-go)** |

Laak's credit model is differentiated — lower barrier to entry, aligns with prepaid culture in developing markets, no churn risk. Trade-off: less predictable revenue vs subscriptions.

---

## 7. RevenueCat Architecture

- **Consumable products** (`credits_*`): Must NOT be linked to entitlements. Wire to `LAK` virtual currency via product grants.
- **Non-consumable** (`unlock_all_lifetime`): Linked to "FinAI Pro" entitlement.
- **Offerings:** Separate "credits" offering for credit packs.
- **Virtual currency:** `LAK` (already created in RC, needs product grants configured).

---

## 8. Key Assumptions to Validate

- [ ] 60/40 split between AI queries and feature unlocks (affects blended cost per credit)
- [ ] $0.005 blended LLM cost holds as usage scales
- [ ] 2.5% Egypt conversion rate at $0.99 entry point
- [ ] 5% Saudi conversion rate with higher ARPU
- [ ] Affiliate revenue materializes at projected levels
- [ ] Credit card penetration gap in Egypt doesn't suppress conversion below projections

---

*Last updated: March 2026*
*Next review: After Egypt MVP launch with real conversion data*
