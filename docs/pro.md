# Pro Features & Monetization Strategy — Laak

> Privacy is the engine. Sharia is the booster. Investment builds trust. Finance management monetizes it.

---

## Strategic Vision

Laak evolves from a **halal wealth visualizer** into a **private personal finance manager** — like hiring a finance/accounting manager for your personal life, one that never sees your data.

### The Trust Ladder

Users don't pay for a finance app on day one. They pay after trust is earned:

1. **Investment visualizer (free)** — user tracks portfolio, sees Laak is reliable, private, accurate
2. **Credits (pay-per-use)** — user runs calculators, gets value from AI analysis on demand
3. **Quarterly subscription (Laak Manager)** — user trusts Laak enough to manage daily finances

Each step earns the right to the next. No user is asked to pay for something they haven't seen the value of.

### Core Positioning

**"The finance manager that never sees your money."**

This pitch works in Cairo, Riyadh, Jakarta, Lagos, and Berlin. The Sharia features are a power-up for ~1.9B Muslims, but the core product stands without them. Privacy captures the broad market; Sharia wins the Muslim segment with an unfair advantage.

| | Before (visualizer only) | After (private finance manager) |
|---|---|---|
| Competing with | Portfolio trackers | YNAB, Money Lover, Cleo, bank apps |
| Differentiator | Sharia + privacy | Privacy-first + on-device AI |
| TAM | Muslim investors | Anyone who manages money and doesn't trust cloud apps |

### Why Not Bank Linking

Bank linking is not viable in Laak's target markets and would contradict the north star:

- **Egypt:** No open banking framework. No third-party bank APIs. No aggregators.
- **Saudi/GCC:** SAMA open banking is early-stage, requires regulatory licensing.
- **SEA:** Aggregators exist (Brankas, Finverse) but cost $0.10-0.50/account/month — eats margins at target price points.
- **Privacy conflict:** "We never see your data" and "connect your bank account through our servers" cannot coexist.

**SMS parsing is Laak's "bank linking."** Banks in MENA/SEA send detailed transaction SMSes. On-device AI parses them — free, private, no API costs, covers 70-80% of transactions. This is the moat.

### Benchmark: Money Lover

Money Lover (Finsify, Vietnam) is the closest competitor — 10M+ downloads, emerging-market focus, manual entry.

| Aspect | Money Lover | Laak |
|---|---|---|
| Input method | Manual entry + cloud bank linking | SMS parsing (on-device) + manual entry |
| Privacy | Cloud-based | On-device, nothing leaves the phone |
| AI | None | On-device categorization, insights, NL queries |
| Islamic finance | None | Sharia screening, zakat, purification |
| Pricing | Lifetime ~$10-20 + subscription add-ons | Credits + quarterly subscription |
| Revenue | ~$20K/mo on 10M downloads (modest) | — |

Money Lover's lifetime purchase model caps LTV hard. Their ~$20K/mo revenue on 10M downloads is a warning against one-time pricing.

---

## Monetization Model

### Two Mechanisms, Not Three

| Mechanism | Covers | Usage pattern |
|---|---|---|
| **Credits** (buy as needed) | Calculators, AI queries, What-If tools | Spiky — used occasionally for specific questions |
| **Quarterly subscription** (Laak Manager) | Multiple portfolios + cross-portfolio intelligence + finance manager + monthly credit refresh | Continuous — used daily/weekly |

**Privacy is free. Always.** It's the reason people come, never a paywall. On-device processing is the baseline, not a tier.

### Why Quarterly Billing

Quarterly is the sweet spot for Laak's target markets — backed by behavioral economics research:

**Payment Depreciation Effect** (Gourville & Soman, 1998): The psychological impact of a payment fades over time. Lifetime purchasers gradually treat the product like something they got for free. Quarterly payments re-activate sunk cost motivation each cycle, driving more usage and higher perceived value.

**The virtuous cycle:** Pay → feel invested → use the app → get value → renewal feels fair → pay again. Lifetime pricing breaks this at step one.

**Quarterly vs monthly vs annual:**
- Monthly: highest churn (~5-7%), feels like a constant leak in emerging markets
- Annual: lowest churn but highest conversion barrier; payment shock at renewal
- Quarterly: ~30-40% lower churn than monthly, aligns with natural evaluation windows (Thaler's mental accounting, 1985), comfortable commitment in price-sensitive markets

**MENA-specific:** Wamda/MIT research shows Egyptian users prefer knowing total cost upfront — subscriptions feel open-ended. Quarterly is infrequent enough to not trigger subscription fatigue, while GCC users are comfortable with recurring payments.

### Why Credit Refresh Works

Quarterly subscribers get a monthly credit refresh (e.g., 5-8 credits). This triggers three documented psychological effects:

1. **Endowed Progress** (Nunes & Dreze, 2006): Credits arriving feel like a gift already "owned" — users are motivated to not waste them.
2. **Idleness Aversion** (Hsee et al., 2010): Credits create a task ("use your 5 analyses") — people prefer activity over inaction.
3. **Loss Aversion / Scarcity** (Kahneman & Tversky, 1979; Cialdini, 1984): "3 credits remaining" creates urgency. Losing unused credits feels like waste.

This is why Audible's credit-per-month model has famously low churn. Users accumulate credits and feel they can't cancel without losing what they have.

### "Unlock All" Framing

The quarterly subscription is framed as "Unlock Laak Manager" — not "subscribe to access."

**Psychological Ownership** (Pierce et al., 2001): When users perceive they're _unlocking_ something, they assign it to their mental inventory. The endowment effect kicks in — canceling feels like losing possessions, not stopping a payment.

Duolingo, Headspace, and Blinkist all shifted to "Unlock" framing with measurable retention improvements.

### Subscription Fairness

**Fairness Heuristic** (Kahneman et al., 1986): Users accept ongoing payments when they map to perceived ongoing costs. AI analysis credits provide this justification — "you're paying because we run computations for you." Without the AI component, a portfolio tracker subscription would feel like rent-seeking.

### Anti-Patterns to Avoid

- **No dark patterns:** Easy cancellation, transparent pricing. Reactance (Brehm, 1966) from difficult cancellation creates active hostility — worse than churn.
- **No nickel-and-diming:** The subscription unlocks everything. Add-on upsells on top of a subscription trigger price partitioning resentment (Morwitz et al., 1998).
- **No dead zone:** Users who don't engage within 48-72 hours of subscribing have ~60-70% churn probability. The credit refresh and onboarding must drive immediate engagement.
- **Subscription auditing defense:** 44% of consumers periodically audit and cut subscriptions (Deloitte, 2023). Active engagement via credits, progress visualization, and real value keeps Laak off the chopping block.

### Pricing (Target)

| Market | Quarterly price | Notes |
|---|---|---|
| Egypt | ~$3-6/quarter | Price-sensitive, highest friction to recurring |
| Saudi/GCC | ~$12-15/quarter | Higher willingness to pay |
| Malaysia/SEA | ~$4-8/quarter | Bundle-value framing works best |

Credits purchased à la carte for non-subscribers at standard rates.

---

## Phase 1: Investment Features (Current)

### 1. Plan Tab — Investment Calculators

> Pure math tools that answer real investor questions using historical data and user inputs. No opinions, no predictions, no advice.

#### Why This Exists

Investors constantly ask "what if" questions: "I have X, what happens if I put it in Y?" These calculators answer that with math — not chat, not AI opinions. Legally safe in every target market because they're calculators, not advisors.

#### Calculators

##### 1.1 Return Simulator

**Question:** "I have $10K, what would it have done in [stock/asset class] over the last 5 years?"

| Field | Detail |
|---|---|
| Inputs | Lump sum amount, asset or asset class, historical time period |
| Output | Historical return chart, final value, max drawdown, worst period |
| Credits | 2 (fetches historical price data) |
| Data source | Market data API (attributed) |

**Important:** Must show downside scenarios (worst period, max drawdown) alongside the growth path — not just the rosy outcome. Users will treat historical data as forward-looking signal; honest presentation counteracts this.

##### 1.2 DCA Calculator

**Question:** "If I invest $200/month into [asset class] for 3 years?"

| Field | Detail |
|---|---|
| Inputs | Monthly amount, asset class, time period |
| Output | Growth curve, total invested vs current value, average cost basis |
| Credits | 2 (fetches historical price data) |
| Data source | Market data API (attributed) |

##### 1.3 Goal Gap Calculator

**Question:** "I need $50K in 5 years, how much monthly?"

| Field | Detail |
|---|---|
| Inputs | Target amount, timeline, expected annual return % (user picks from historical ranges) |
| Output | Required monthly contribution, total contributions vs growth split |
| Credits | 1 (pure math, no data fetch) |
| Offline | Yes |

**Important:** App shows historical return ranges as reference (e.g. "EGX averaged 8-14% over last 10 years"), but the user explicitly picks the number. App never assigns an expected return.

##### 1.4 What-If Rebalancer

**Question:** "What if I move 20% from stocks to sukuk?"

| Field | Detail |
|---|---|
| Inputs | Current portfolio (auto-loaded) + hypothetical allocation changes |
| Output | Side-by-side comparison using historical data — old vs new allocation |
| Credits | 3 (complex, uses portfolio + historical data) |
| Data source | Portfolio data + market data API |

##### 1.5 Purification Projector

**Question:** "How much purification will I owe in 12 months?"

| Field | Detail |
|---|---|
| Inputs | Current holdings, historical purification rates per stock |
| Output | Estimated annual purification amount, per-holding breakdown |
| Credits | 2 (uses holding data + screening data) |
| Data source | Screening data (attributed) |

##### 1.6 Zakat Planner

**Question:** "When is my zakat due and how much?"

| Field | Detail |
|---|---|
| Inputs | Holdings, haul start date (lunar year), nisab threshold |
| Output | Zakat due date, estimated amount, per-asset breakdown |
| Credits | 1 (pure math on existing data) |
| Offline | Yes |

#### Design Rules

1. **All math, no opinions** — calculators use historical data or user-supplied assumptions, never AI-generated predictions
2. **User supplies the return assumption** — app shows historical ranges as reference, user picks the number. App never says "expect X%"
3. **Attribution everywhere** — "Historical returns based on [EGX data / Tadawul data / asset class index] over [period]"
4. **Disclaimer footer on every calculator** — "Past performance does not indicate future results. This is a calculator, not advice."
5. **No specific stock recommendations** — calculators work with asset classes or stocks the user already owns/selects
6. **Show the downside** — every historical simulation must include worst-case periods and drawdowns, not just growth

#### Credit Summary

| Calculator | Credits | Works Offline |
|---|---|---|
| Return Simulator | 2 | No |
| DCA Calculator | 2 | No |
| Goal Gap Calculator | 1 | Yes |
| What-If Rebalancer | 3 | No |
| Purification Projector | 2 | No |
| Zakat Planner | 1 | Yes |

#### What This Tab Is NOT

- Not a chat interface
- Not personalized recommendations
- Not return predictions — only historical simulations or user-supplied assumptions
- Not "you should invest in X" — it's "here's what $X in Y would have looked like"

---

### 2. Multiple Portfolios (Quarterly Subscription)

> Separate your wealth by purpose. See each bucket's progress — and the full picture across all of them.

#### Why This Exists

Investors don't think in "one portfolio." They think in buckets: money for Hajj, money for the kids, retirement, zakat-eligible assets, and general growth. Every spreadsheet-savvy investor already does this manually. Laak makes it native, visual, and Sharia-aware.

Free users get one portfolio. Quarterly subscription unlocks up to 7 — each with its own goal, timeline, and tracking.

#### Portfolio Types

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

#### Core Features

##### 2.1 Portfolio CRUD

| Field | Detail |
|---|---|
| Create | Name, goal type, optional target amount, optional target date, optional icon/color |
| Edit | All fields editable anytime |
| Delete | Confirmation required, holdings are not deleted — moved to "Unassigned" or user picks destination |
| Limit | 7 portfolios max (free gets 1, subscription gets 7) |
| Default | First portfolio is "Main" — always exists, cannot be deleted |
| Offline | Yes — all CRUD is local, synced to userDb |

##### 2.2 Consolidated View

A single screen that shows the full picture across all portfolios:

- **Total net worth** — sum of all portfolios, single number at the top
- **Breakdown donut** — each portfolio as a slice, colored by goal type
- **Per-portfolio cards** — name, total value, gain/loss %, goal progress (if applicable)
- **Compliance summary** — one Sharia status across everything. A single non-compliant holding anywhere flags the whole picture
- **Asset class heatmap** — allocation across all portfolios combined (e.g. "70% equities, 20% sukuk, 10% gold")

**This is the default view when the user has 2+ portfolios.** Tapping a portfolio card drills into it.

##### 2.3 Cross-Portfolio Intelligence

These insights appear in the consolidated view and are the key differentiator from "just having folders":

**Overlap Detection**
"You hold SABIC in 3 portfolios — total exposure: 18% of net worth"
- Shows per-holding across all portfolios
- Flags concentration risk without advising — "X% of your total wealth is in one stock"

**Diversification Score**
- Calculated across all portfolios combined, not siloed
- Based on asset class, sector, geography, and currency distribution
- Visual: radar chart or simple bar breakdown
- No "good/bad" labels — just "here's your distribution"

**Compliance Gaps**
- Per-portfolio and consolidated compliance status
- If a holding fails screening in one portfolio, it's flagged everywhere
- "3 of 4 portfolios are fully compliant. Retirement has 1 holding under review."

##### 2.4 What-If Transfers

Move holdings between portfolios with impact preview before confirming:

| Step | Detail |
|---|---|
| 1. Select | Long-press a holding → "Move to..." → pick destination portfolio |
| 2. Preview | Side-by-side impact on both portfolios: compliance change, allocation shift, goal progress delta |
| 3. Confirm | Single tap to execute — holding moves, both portfolios recalculate |

**This is the calculator identity at its best** — not advising, just showing consequences of a move before you make it.

##### 2.5 Zakat Integration

- Each portfolio can be marked as **zakat-eligible** or **exempt** (e.g. primary residence real estate)
- Zakat calculation runs across eligible portfolios only
- Per-holding breakdown shows which portfolio each zakatable asset lives in
- Haul date (lunar year anniversary) tracked per portfolio or globally (user choice)

| Field | Detail |
|---|---|
| Inputs | Eligible portfolios, nisab threshold, haul date |
| Output | Total zakat due, per-portfolio breakdown, per-holding breakdown |
| Credits | 0 (included with subscription — core portfolio feature, not a calculator) |
| Offline | Yes |

#### Data Model

##### Portfolio table (userDb)

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

##### Holdings change

Existing `holdings` table gets a new column:

```
portfolioId   TEXT REFERENCES portfolios(id) DEFAULT '{main-portfolio-id}'
```

**Migration safety:** All existing holdings get assigned to the auto-created "Main" portfolio. No data loss, backwards compatible.

#### Design Rules

1. **7 portfolio cap** — free gets 1, subscription gets 7. If demand emerges for more, raise the cap in a future tier
2. **Consolidated view is default** — individual portfolio is a drill-down. The full picture matters most
3. **Cross-portfolio insights are the product** — without them, this is just folders. The overlap detection, diversification score, and compliance summary justify the subscription
4. **No portfolio-level advice** — app never says "your Hajj fund is too aggressive." It shows allocation and lets the user decide
5. **Transfers show consequences, not recommendations** — "Moving X changes your allocation to Y" not "You should move X"
6. **Zakat is built-in, not a separate calculator** — when you have multiple portfolios, zakat eligibility per-portfolio is a natural feature, not an upsell
7. **Goal progress is descriptive** — "You're at 60% of your Hajj target" not "You need to invest more"

#### Monetization

| Feature | Mechanism | Notes |
|---|---|---|
| Create portfolio (2-7) | Quarterly subscription | Part of unlock |
| Consolidated view | Quarterly subscription | Part of unlock |
| Overlap detection | Quarterly subscription | Part of unlock |
| Diversification score | Quarterly subscription | Part of unlock |
| What-If Transfer preview | 1 credit | Uses computation; subscribers use from refresh allocation |
| Zakat across portfolios | Quarterly subscription | Part of unlock |

#### What This Feature Is NOT

- Not a robo-advisor that auto-allocates across portfolios
- Not a recommendation engine — "put your Hajj money in sukuk" is never said
- Not unlimited — the 7-portfolio cap is a design choice, not an arbitrary limit
- Not a separate app section — portfolios are the core data model, everything else (calculators, screening, insights) works with them

---

## Phase 2: Personal Finance Manager (Future — Quarterly Subscription)

> Like hiring a finance manager who lives on your phone, sees everything, and tells no one.

### Why This Exists

The investment visualizer proves Laak is trustworthy with sensitive financial data. Users who've tracked their portfolio for weeks/months have already trusted Laak with their net worth — extending to daily spending is a smaller ask. The finance manager is the monetization layer built on earned trust.

### What a "Finance Manager" Does

Breaking down what a personal accountant does for an ordinary person:

| Function | Laak's approach |
|---|---|
| **Tracking** | SMS parsing (on-device) + manual entry + receipt OCR |
| **Organizing** | AI categorization — on-device model sorts transactions |
| **Reporting** | Monthly summaries, trends, comparisons, natural language queries |
| **Planning** | Budgets, savings goals, debt payoff schedules |
| **Alerting** | "You're overspending on X", "bill due in 3 days" |
| **Zakat/Tax** | Seasonal calculations across full financial picture |

### The Input Problem (Critical)

A finance manager is only useful if it has data. Without bank linking, three input methods in priority order:

#### 1. SMS Parsing (Primary — the unlock)

Banks in MENA/SEA send detailed transaction SMSes — amount, merchant, balance. On-device AI parses them.

- **Free** (no API costs)
- **Private** (on-device, nothing leaves the phone)
- **Covers 70-80%** of transactions in target markets
- **Reinforces privacy story:** "Other apps ask for your bank password. Laak reads your SMS on your phone — nothing leaves."

This is the make-or-break feature. If users adopt SMS-based tracking and keep using it past week 2, the product works.

#### 2. Receipt OCR (Secondary)

Camera → on-device model → categorized expense. Useful for cash transactions that don't generate SMS.

#### 3. Manual Entry (Fallback)

Must exist but cannot be the primary method. Manual-entry-only finance apps have 90%+ churn.

### On-Device AI Constraints

"Hiring a finance manager" implies intelligence. Running on-device means:

- Small models (quantized, ~1-4GB)
- Limited reasoning vs cloud AI
- **But perfectly adequate for:** categorization, pattern matching, template responses, basic forecasting

Finance is structured data. A small model with good prompting and local RAG over transaction history delivers 80% of the value of cloud AI for these tasks. Apple proved the on-device intelligence model works in iOS 18/19. Laak does the same for finance specifically, cross-platform, in markets Apple under-serves.

### Finance Manager Features

#### 2.1 Expense Tracking

- Auto-parsed from SMS with AI categorization
- Manual entry for cash transactions
- Receipt scanning for paper trails
- All data stored on-device (userDb)

#### 2.2 AI Insights

- Natural language queries: "How much did I spend on groceries last Ramadan?"
- Pattern detection: "Your transport spending increased 40% this month"
- Trend visualization: spending over time by category
- All processed on-device — queries never leave the phone

#### 2.3 Budgets & Goals

- Category-level budgets with progress tracking
- Savings goals tied to timelines
- Debt payoff scheduling with different strategy comparisons
- Integration with investment portfolios for full financial picture

#### 2.4 Alerts & Reminders

- Bill due date reminders
- Budget threshold alerts ("80% of food budget used, 10 days remaining")
- Unusual spending detection
- Zakat/tax season reminders with pre-calculated estimates

### The "Mirror vs Agent" Question

A real finance manager takes action. Laak is a **mirror that shows** — not an agent that acts. The app never says "you should" or moves money. It says "here's what happened, here's the pattern, here's what you asked to see." This is consistent with the investment layer's calculator identity.

### Design Rules

1. **Same identity as investment layer** — calculator, mirror, translator. Never an advisor.
2. **SMS parsing must feel magical** — auto-categorized, instant, zero effort. This is the first impression.
3. **Privacy is the feature, not a limitation** — "Laak parsed 47 transactions this month. None left your device."
4. **Full financial picture** — investments + spending in one place. Net worth = portfolio value + cash - debts.
5. **Sharia-aware but not Sharia-gated** — halal spending categories, zakat across everything, but a non-Muslim user finds full value without these.

### Rollout Phases

| Phase | What ships | Purpose |
|---|---|---|
| **A** (current) | Investment visualizer + Sharia screening | Build trust, validate privacy story |
| **B** (next) | SMS expense tracking + AI categorization | Product-market fit test — do users adopt it? |
| **C** | AI insights + natural language queries | Deepen engagement, justify subscription value |
| **D** | Budgets, goals, alerts, forecasting | Full finance manager experience |
| **E** (future) | Multi-person (family finance via encrypted local sync) | Expand from individual to household |

Phase B is the critical test. Ship in Egypt first where bank SMS formats are known. If users adopt SMS-based tracking past week 2, the product works.

### What This Feature Is NOT

- Not a bank — doesn't hold, move, or access money
- Not an advisor — never says "you should spend less on X"
- Not cloud-dependent — all processing on-device
- Not a replacement for the investment layer — it's an extension of it
- Not Sharia-exclusive — Islamic finance features enhance but don't gate the experience
