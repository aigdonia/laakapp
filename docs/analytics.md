# PostHog Analytics — First 2 Weeks

PostHog dashboard, funnel, cohort, and alert definitions for launch analytics. No code changes — all configured in PostHog's UI using existing events.

## Existing Events

**Auto-captured:** `Application Opened`, `Application Backgrounded`, `$screen` (all screen views via expo-router)

**Onboarding:** `onboarding_started`, `onboarding_screen_viewed`, `onboarding_answer_provided`, `onboarding_skipped`, `onboarding_completed`

**Portfolio:** `holding_add_started`, `asset_type_selected`, `transaction_saved`, `holding_detail_viewed`, `transaction_deleted`

**AI/Insights:** `narrative_generated`, `deep_analysis_generated`, `stock_deepdive_generated`, `credits_spent`

**Monetization:** `credits_screen_viewed`, `purchase_initiated`, `purchase_completed`, `purchase_failed`

**Settings:** `setting_changed`, `app_lock_enabled/disabled`, `backup_created`, `backup_restored`, `data_reset_confirmed`, `account_deleted`, `export_started/completed/failed`, `restore_purchases`

**Auth:** `apple_signin_completed`, `apple_signout_completed`

---

## Dashboard 1: Activation Funnel (Most Important)

**Question:** Are new users reaching value?

**Funnel (ordered steps, 7-day conversion window):**
1. `Application Opened`
2. `onboarding_completed` OR `onboarding_skipped`
3. `transaction_saved` (first holding)
4. `narrative_generated` OR `deep_analysis_generated` (first AI insight)

**Breakdown by:** Platform (iOS/Android), Country (`setting_changed` where `setting=country`)

**What good looks like:** 60%+ complete step 2, 30%+ reach step 3, 15%+ reach step 4

---

## Dashboard 2: Onboarding Health

**Question:** Is onboarding helping or hurting?

**Insight A — Completion Funnel:**
1. `onboarding_started`
2. `onboarding_completed`

**Insight B — Drop-off by Screen:**
- Event: `onboarding_screen_viewed`
- Breakdown by: `screen_index`
- Chart: Bar chart showing volume per screen (declining bars = drop-off points)

**Insight C — Skip Analysis:**
- Event: `onboarding_skipped`
- Breakdown by: `at_screen_index`
- Shows which screens trigger skips

**Insight D — Completers vs Skippers Activation:**
- Two funnels side by side:
  - Cohort A (completed onboarding) → `transaction_saved` within 7 days
  - Cohort B (skipped onboarding) → `transaction_saved` within 7 days
- Answers: does completing onboarding drive better activation?

---

## Dashboard 3: Weekly Retention

**Question:** Are users coming back?

**Retention Table:**
- Cohort: Users grouped by first `Application Opened` date (weekly cohorts)
- Return event: `Application Opened`
- Periods: D1, D3, D7, D14

**What good looks like (week 1-2):** D1 > 40%, D7 > 20%

**Bonus insight — Retention by activation state:**
- Create two cohorts:
  - "Activated" = users who fired `transaction_saved` at least once
  - "Not activated" = users who never fired `transaction_saved`
- Compare retention curves — this proves whether activation matters

---

## Dashboard 4: Core Feature Adoption

**Question:** What are users discovering and using?

**Unique users per feature (rolling 7 days):**

| Metric | Event | Chart |
|---|---|---|
| Added a holding | `transaction_saved` | Unique users / week |
| Generated narrative | `narrative_generated` | Unique users / week |
| Generated deep analysis | `deep_analysis_generated` | Unique users / week |
| Generated stock deep dive | `stock_deepdive_generated` | Unique users / week |
| Viewed credits screen | `credits_screen_viewed` | Unique users / week |
| Viewed holding detail | `holding_detail_viewed` | Unique users / week |

**Feature adoption rate (% of WAU):**
- Denominator: unique users with `Application Opened` in last 7 days
- Numerator: unique users with each feature event in last 7 days

---

## Dashboard 5: Monetization Signals

**Question:** Are users willing to pay?

**Insight A — Purchase Funnel:**
1. `credits_screen_viewed`
2. `purchase_initiated`
3. `purchase_completed`

Conversion rate at each step. Breakdown by `package_id`.

**Insight B — Cancellation Rate:**
- `purchase_failed` where `user_cancelled = true` as % of `purchase_initiated`
- High cancellation = price resistance or UX friction

**Insight C — Credit Spend by Feature:**
- Event: `credits_spent`
- Breakdown by: `feature`
- Shows which AI features drive the most credit consumption

**Insight D — Credits Screen as Demand Signal:**
- `credits_screen_viewed` trend line (daily)
- Spike = users hitting credit wall = demand signal

---

## Dashboard 6: Settings & Preferences (Nice to Have)

**Question:** How are users configuring the app?

- `setting_changed` breakdown by `setting` — which settings do users touch?
- `setting_changed` where `setting=country` breakdown by `value` — user geography
- `setting_changed` where `setting=language` breakdown by `value` — language preference
- `setting_changed` where `setting=sharia_authority` breakdown by `value` — compliance preference
- `apple_signin_completed` trend — account creation rate

---

## Cohorts to Create

| Cohort | Definition | Purpose |
|---|---|---|
| Activated | `transaction_saved` at least once | Core segmentation |
| Power User | `narrative_generated` OR `deep_analysis_generated` at least once | Feature adoption |
| Paying | `purchase_completed` at least once | Revenue cohort |
| Churned | `Application Opened` > 7 days ago, no event since | Re-engagement targeting |
| Onboarding Skipper | `onboarding_skipped` fired, no `onboarding_completed` | Compare behavior |

---

## Alerts

1. **DAU drops >30% day-over-day** — `Application Opened` unique users
2. **Activation rate drops below 20%** — `transaction_saved` / `Application Opened` ratio
3. **Purchase failure spike** — `purchase_failed` count > 2x 7-day average

---

## Priority Order

1. **Activation Funnel** — #1 thing to watch in week 1
2. **Retention Table** — D1-D3 data available by end of week 1
3. **Onboarding Health** — iterate while it's fresh
4. **Feature Adoption** — understand what's landing
5. **Monetization Signals** — meaningful after week 2 when free credits deplete
6. **Settings/Preferences** — background context, set up whenever
