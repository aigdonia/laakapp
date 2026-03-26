# Pro Features — Laak

> Features that require credits or "Unlock All". Specs pile here before implementation.

---

## 1. Plan Tab — Investment Calculators

> Pure math tools that answer real investor questions using historical data and user inputs. No opinions, no predictions, no advice.

### Why This Exists

Investors constantly ask "what if" questions: "I have X, what happens if I put it in Y?" These calculators answer that with math — not chat, not AI opinions. Legally safe in every target market because they're calculators, not advisors.

### Calculators

#### 1.1 Return Simulator

**Question:** "I have $10K, what would it have done in [stock/asset class] over the last 5 years?"

| Field | Detail |
|---|---|
| Inputs | Lump sum amount, asset or asset class, historical time period |
| Output | Historical return chart, final value, max drawdown, worst period |
| Credits | 2 (fetches historical price data) |
| Data source | Market data API (attributed) |

**Important:** Must show downside scenarios (worst period, max drawdown) alongside the growth path — not just the rosy outcome. Users will treat historical data as forward-looking signal; honest presentation counteracts this.

#### 1.2 DCA Calculator

**Question:** "If I invest $200/month into [asset class] for 3 years?"

| Field | Detail |
|---|---|
| Inputs | Monthly amount, asset class, time period |
| Output | Growth curve, total invested vs current value, average cost basis |
| Credits | 2 (fetches historical price data) |
| Data source | Market data API (attributed) |

#### 1.3 Goal Gap Calculator

**Question:** "I need $50K in 5 years, how much monthly?"

| Field | Detail |
|---|---|
| Inputs | Target amount, timeline, expected annual return % (user picks from historical ranges) |
| Output | Required monthly contribution, total contributions vs growth split |
| Credits | 1 (pure math, no data fetch) |
| Offline | Yes |

**Important:** App shows historical return ranges as reference (e.g. "EGX averaged 8-14% over last 10 years"), but the user explicitly picks the number. App never assigns an expected return.

#### 1.4 What-If Rebalancer

**Question:** "What if I move 20% from stocks to sukuk?"

| Field | Detail |
|---|---|
| Inputs | Current portfolio (auto-loaded) + hypothetical allocation changes |
| Output | Side-by-side comparison using historical data — old vs new allocation |
| Credits | 3 (complex, uses portfolio + historical data) |
| Data source | Portfolio data + market data API |

#### 1.5 Purification Projector

**Question:** "How much purification will I owe in 12 months?"

| Field | Detail |
|---|---|
| Inputs | Current holdings, historical purification rates per stock |
| Output | Estimated annual purification amount, per-holding breakdown |
| Credits | 2 (uses holding data + screening data) |
| Data source | Screening data (attributed) |

#### 1.6 Zakat Planner

**Question:** "When is my zakat due and how much?"

| Field | Detail |
|---|---|
| Inputs | Holdings, haul start date (lunar year), nisab threshold |
| Output | Zakat due date, estimated amount, per-asset breakdown |
| Credits | 1 (pure math on existing data) |
| Offline | Yes |

### Design Rules

1. **All math, no opinions** — calculators use historical data or user-supplied assumptions, never AI-generated predictions
2. **User supplies the return assumption** — app shows historical ranges as reference, user picks the number. App never says "expect X%"
3. **Attribution everywhere** — "Historical returns based on [EGX data / Tadawul data / asset class index] over [period]"
4. **Disclaimer footer on every calculator** — "Past performance does not indicate future results. This is a calculator, not advice."
5. **No specific stock recommendations** — calculators work with asset classes or stocks the user already owns/selects
6. **Show the downside** — every historical simulation must include worst-case periods and drawdowns, not just growth

### Credit Summary

| Calculator | Credits | Works Offline |
|---|---|---|
| Return Simulator | 2 | No |
| DCA Calculator | 2 | No |
| Goal Gap Calculator | 1 | Yes |
| What-If Rebalancer | 3 | No |
| Purification Projector | 2 | No |
| Zakat Planner | 1 | Yes |

### What This Tab Is NOT

- Not a chat interface
- Not personalized recommendations
- Not return predictions — only historical simulations or user-supplied assumptions
- Not "you should invest in X" — it's "here's what $X in Y would have looked like"
