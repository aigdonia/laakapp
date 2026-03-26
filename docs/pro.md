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

---

## 2. Multiple Portfolios

> Separate your wealth by purpose. See each bucket's progress — and the full picture across all of them.

### Why This Exists

Muslim investors don't think in "one portfolio." They think in buckets: money for Hajj, money for the kids, retirement, zakat-eligible assets, and general growth. Every spreadsheet-savvy investor already does this manually. Laak makes it native, visual, and Sharia-aware.

Free users get one portfolio. Pro unlocks up to 7 — each with its own goal, timeline, and tracking.

### Portfolio Types

Each portfolio is created with a **goal type** that shapes its UI and behavior:

| Goal Type | UI Treatment |
|---|---|
| General Growth | Standard portfolio view — allocation donut, holdings list, P&L |
| Hajj Fund | Progress ring toward target amount + target date countdown |
| Children's Education | Progress ring + milestone markers (e.g. "University in 4 years") |
| Retirement | Projected runway — "At current rate, covers X years of expenses" |
| Emergency Fund | Target amount with liquidity indicator (how fast can you access it) |
| Zakat Base | Holdings eligible for zakat — auto-calculates 2.5% obligation |
| Custom | User names it, optional target amount + date |

**Implementation note:** Goal type is a `slug` field on the portfolio, not a separate table. The UI layer reads the slug and renders the appropriate visualization. Adding new goal types = adding a new slug + UI component, no schema change.

### Core Features

#### 2.1 Portfolio CRUD

| Field | Detail |
|---|---|
| Create | Name, goal type, optional target amount, optional target date, optional icon/color |
| Edit | All fields editable anytime |
| Delete | Confirmation required, holdings are not deleted — moved to "Unassigned" or user picks destination |
| Limit | 7 portfolios max (intentional constraint — feels designed, not just unlocked) |
| Default | First portfolio is "Main" — always exists, cannot be deleted |
| Offline | Yes — all CRUD is local, synced to userDb |

#### 2.2 Consolidated View

A single screen that shows the full picture across all portfolios:

- **Total net worth** — sum of all portfolios, single number at the top
- **Breakdown donut** — each portfolio as a slice, colored by goal type
- **Per-portfolio cards** — name, total value, gain/loss %, goal progress (if applicable)
- **Compliance summary** — one Sharia status across everything. A single non-compliant holding anywhere flags the whole picture
- **Asset class heatmap** — allocation across all portfolios combined (e.g. "70% equities, 20% sukuk, 10% gold")

**This is the default view when the user has 2+ portfolios.** Tapping a portfolio card drills into it.

#### 2.3 Cross-Portfolio Intelligence

These insights appear in the consolidated view and are the key differentiator from "just having folders":

##### Overlap Detection
"You hold SABIC in 3 portfolios — total exposure: 18% of net worth"
- Shows per-holding across all portfolios
- Flags concentration risk without advising — "X% of your total wealth is in one stock"

##### Diversification Score
- Calculated across all portfolios combined, not siloed
- Based on asset class, sector, geography, and currency distribution
- Visual: radar chart or simple bar breakdown
- No "good/bad" labels — just "here's your distribution"

##### Compliance Gaps
- Per-portfolio and consolidated compliance status
- If a holding fails screening in one portfolio, it's flagged everywhere
- "3 of 4 portfolios are fully compliant. Retirement has 1 holding under review."

#### 2.4 What-If Transfers

Move holdings between portfolios with impact preview before confirming:

| Step | Detail |
|---|---|
| 1. Select | Long-press a holding → "Move to..." → pick destination portfolio |
| 2. Preview | Side-by-side impact on both portfolios: compliance change, allocation shift, goal progress delta |
| 3. Confirm | Single tap to execute — holding moves, both portfolios recalculate |

**This is the calculator identity at its best** — not advising, just showing consequences of a move before you make it.

#### 2.5 Zakat Integration

- Each portfolio can be marked as **zakat-eligible** or **exempt** (e.g. primary residence real estate)
- Zakat calculation runs across eligible portfolios only
- Per-holding breakdown shows which portfolio each zakatable asset lives in
- Haul date (lunar year anniversary) tracked per portfolio or globally (user choice)

| Field | Detail |
|---|---|
| Inputs | Eligible portfolios, nisab threshold, haul date |
| Output | Total zakat due, per-portfolio breakdown, per-holding breakdown |
| Credits | 0 (included with Pro — it's a core portfolio feature, not a calculator) |
| Offline | Yes |

### Data Model

#### Portfolio table (userDb)

```
portfolios
  id            TEXT PRIMARY KEY
  name          TEXT NOT NULL
  goalType      TEXT NOT NULL DEFAULT 'general'  -- slug: general, hajj, education, retirement, emergency, zakat, custom
  icon          TEXT DEFAULT ''                   -- emoji or icon key
  color         TEXT DEFAULT '#6b7280'
  targetAmount  REAL                             -- nullable, for goal types with targets
  targetDate    TEXT                             -- nullable, ISO date
  currency      TEXT NOT NULL DEFAULT 'EGP'
  order         INTEGER NOT NULL DEFAULT 0
  createdAt     TEXT NOT NULL
  updatedAt     TEXT NOT NULL
```

#### Holdings change

Existing `holdings` table gets a new column:

```
portfolioId   TEXT REFERENCES portfolios(id) DEFAULT '{main-portfolio-id}'
```

**Migration safety:** All existing holdings get assigned to the auto-created "Main" portfolio. No data loss, backwards compatible.

### Design Rules

1. **7 portfolio cap** — not unlimited. Feels intentional. If someone needs 8, they're probably overcomplicating things
2. **Consolidated view is default** — individual portfolio is a drill-down. The full picture matters most
3. **Cross-portfolio insights are the product** — without them, this is just folders. The overlap detection, diversification score, and compliance summary are what make it Pro
4. **No portfolio-level advice** — app never says "your Hajj fund is too aggressive." It shows allocation and lets the user decide
5. **Transfers show consequences, not recommendations** — "Moving X changes your allocation to Y" not "You should move X"
6. **Zakat is built-in, not a separate calculator** — when you have multiple portfolios, zakat eligibility per-portfolio is a natural feature, not an upsell
7. **Goal progress is descriptive** — "You're at 60% of your Hajj target" not "You need to invest more"

### Credit / Monetization

| Feature | Credits | Notes |
|---|---|---|
| Create portfolio | 0 | Part of Pro unlock |
| Consolidated view | 0 | Part of Pro unlock |
| Overlap detection | 0 | Part of Pro unlock |
| Diversification score | 0 | Part of Pro unlock |
| What-If Transfer preview | 1 | Light computation |
| Zakat across portfolios | 0 | Part of Pro unlock |

**Rationale:** Multiple portfolios is an "Unlock All" feature, not credit-gated. Nickel-and-diming portfolio management would feel hostile. The What-If Transfer preview costs 1 credit because it involves computation, but core portfolio features are included.

### What This Feature Is NOT

- Not a robo-advisor that auto-allocates across portfolios
- Not a recommendation engine — "put your Hajj money in sukuk" is never said
- Not a budgeting tool — it tracks investments, not spending
- Not unlimited — the 7-portfolio cap is a feature, not a limitation
- Not a separate app section — portfolios are the core data model, everything else (calculators, screening, insights) works with them
