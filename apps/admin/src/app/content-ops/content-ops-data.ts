/* ── Schedule, templates, and constants for Content Ops ──── */

export type ScheduleItem = {
  id: string
  platform: "reddit" | "x"
  label: string
  description: string
}

export type DaySchedule = {
  day: number // 0=Mon … 6=Sun
  label: string
  items: ScheduleItem[]
}

export const DEFAULT_SCHEDULE: DaySchedule[] = [
  {
    day: 0,
    label: "Mon",
    items: [
      {
        id: "mon-reddit-comment",
        platform: "reddit",
        label: "Comment in r/islamicfinance",
        description: "Value-add comment, no promotion",
      },
      {
        id: "mon-x-stock",
        platform: "x",
        label: "Stock Intelligence Tweet",
        description: "Share a stock insight with data",
      },
    ],
  },
  {
    day: 1,
    label: "Tue",
    items: [
      {
        id: "tue-x-builder",
        platform: "x",
        label: "Builder Journey Tweet",
        description: "Share building progress, lessons learned",
      },
    ],
  },
  {
    day: 2,
    label: "Wed",
    items: [
      {
        id: "wed-reddit-edu",
        platform: "reddit",
        label: "Educational Post (Tier 1)",
        description:
          "Long-form educational post in r/islamicfinance or r/halal_investing",
      },
      {
        id: "wed-x-stock",
        platform: "x",
        label: "Stock Intelligence Tweet",
        description: "Share a stock insight with data",
      },
    ],
  },
  {
    day: 3,
    label: "Thu",
    items: [
      {
        id: "thu-reddit-comment",
        platform: "reddit",
        label: "Comment in r/investing or r/stocks",
        description: "Helpful comment in mainstream finance subs",
      },
      {
        id: "thu-x-privacy",
        platform: "x",
        label: "Privacy Take Tweet",
        description: "Privacy-focused financial take",
      },
    ],
  },
  {
    day: 4,
    label: "Fri",
    items: [
      {
        id: "fri-x-stock",
        platform: "x",
        label: "Stock Intelligence Tweet",
        description: "Share a stock insight with data",
      },
      {
        id: "fri-x-poll",
        platform: "x",
        label: "Community Poll",
        description: "Engagement poll about investing",
      },
    ],
  },
  {
    day: 5,
    label: "Sat",
    items: [
      {
        id: "sat-reddit-browse",
        platform: "reddit",
        label: "Browse + Comment (Tier 1)",
        description: "Browse and comment in Tier 1 subs",
      },
      {
        id: "sat-x-engage",
        platform: "x",
        label: "Engagement",
        description: "Reply to others, retweet, engage",
      },
    ],
  },
  {
    day: 6,
    label: "Sun",
    items: [
      {
        id: "sun-rest",
        platform: "x",
        label: "Rest / Light Engagement",
        description: "Optional light engagement only",
      },
    ],
  },
]

/* ── Content Bank Templates ──────────────────────────────── */

export type ContentTemplate = {
  id: string
  title: string
  description: string
  copyText: string
  tags: string[]
}

export const REDDIT_TEMPLATES: ContentTemplate[] = [
  {
    id: "reddit-did-you-know",
    title: 'The "Did You Know" Post',
    description:
      "Share a stock threshold crossing or compliance change with financial context. No app mention.",
    copyText: `Title: [Stock] just [crossed/dropped below] the [X]% debt threshold — here's what it means

[2-3 sentences on what changed financially]

For those tracking Sharia compliance, this moves [Stock] from [compliant/non-compliant] to [status].

But beyond compliance, here's what the financials actually look like:
- Revenue: [trend]
- Debt ratio: [number and direction]
- Sector position: [brief]`,
    tags: ["Educational", "Tier 1", "Weekly"],
  },
  {
    id: "reddit-comparison",
    title: "The Comparison Post",
    description:
      "Honest pricing/feature comparison of halal screening apps. Mention Laak as what you're building.",
    copyText: `Title: I compared the cost of halal screening apps — here's what I found

Genuine question. I've been looking at the market:
- Islamicly: $25/mo
- Zoya: $15/mo ($120/yr)
- Musaffa: ~$10/mo

All three basically do the same thing: tell you if a stock passes or fails.

No financial analysis. No AI. No "here's WHY this stock is worth your money."

Am I missing something, or is there room for something better?

[If asked what you're building, then share. Don't volunteer first.]`,
    tags: ["Competitive", "Tier 1", "Bi-weekly"],
  },
  {
    id: "reddit-i-built-this",
    title: 'The "I Built This" Post',
    description:
      "Builder story for r/SideProject or r/startups. Technical choices, why you started, screenshots.",
    copyText: `Title: I built a privacy-first investment companion that does AI stock analysis — here's what I learned

Why I started:
Every halal investing app requires an account + broker linking. I wanted something that keeps portfolio data on-device.

Technical choices:
- On-device storage (no backend for user data)
- AI-powered financial analysis (not just pass/fail screening)
- Pay-per-use credits instead of monthly subscription

What it does:
[Screenshots and brief feature walkthrough]

What I learned:
[Honest lessons from building]`,
    tags: ["Builder", "r/SideProject", "Once"],
  },
  {
    id: "reddit-educational",
    title: "The Educational Thread",
    description:
      "Walk through a real stock analysis — revenue, debt, sector. Compliance as final filter.",
    copyText: `Title: How to actually evaluate if a stock is financially healthy (beyond just halal/haram)

Most discussions I see focus on compliance status — pass or fail. But that tells you nothing about whether it's a good investment.

Here's how I evaluate a stock:

1. Revenue trends (3-year direction)
2. Debt ratios (not just for compliance — for financial health)
3. Sector position and competitive moat
4. Valuation (P/E, P/B relative to sector)

Then I apply the compliance filter last.

[Walk through with a real example]`,
    tags: ["Educational", "Tier 1 + Tier 2", "Weekly"],
  },
  {
    id: "reddit-pain-point",
    title: "The Pain Point Response",
    description:
      "Template for replying to common questions in comments. Provide value first, mention Laak only if relevant.",
    copyText: `[Answer the specific question with genuine knowledge]

[Provide data or reasoning, not just opinion]

[If directly relevant:] I've been building a tool that helps with exactly this — happy to share if interested.

[If not relevant: just leave it as helpful knowledge. No app mention.]`,
    tags: ["Comment", "Daily", "All subs"],
  },
  {
    id: "reddit-privacy",
    title: "The Privacy Angle",
    description:
      "For r/privacy and r/degoogle. Why investment apps shouldn't need your brokerage login.",
    copyText: `Title: Why do investment apps need your brokerage login? I built one that doesn't

Think about what your investment app knows about you:
- Every stock you own
- How much money you have invested
- Your trading patterns and timing
- Your risk tolerance (inferred from behavior)

Most apps require an account and broker linking to function. That's a LOT of financial data you're handing over.

I built an investment companion that stores everything on-device:
- No account required
- No broker linking
- No server-side portfolio data
- Works offline

[Brief explanation of how on-device storage works technically]`,
    tags: ["Privacy", "r/privacy", "Monthly"],
  },
  {
    id: "reddit-ama",
    title: "The AMA / Feedback Post",
    description:
      "Launch AMA in Tier 1 sub. Transparent, invite criticism, show real product.",
    copyText: `Title: I built Laak — an AI-powered investment companion with halal filtering. AMA / roast my app

What it does:
- AI-powered stock analysis (not just pass/fail compliance)
- On-device portfolio tracking (no server, no account)
- Pay-per-use credits (no subscription)

What it doesn't do:
- No trading/brokerage
- No financial advice
- Only covers US market right now

I'm the solo builder. Happy to answer anything about the product, the tech, or the business model. Roast welcome.`,
    tags: ["Launch", "Tier 1", "Once"],
  },
  {
    id: "reddit-technical",
    title: "The Technical Deep-Dive",
    description:
      "For r/reactnative and r/expo. Pure technical content — architecture, performance, libraries.",
    copyText: `Title: How I built [feature] in React Native — architecture breakdown

Problem:
[What you were solving]

Why existing solutions didn't work:
[Brief explanation]

My approach:
[Libraries, patterns, code snippets]

Performance results:
[Metrics, before/after if applicable]

What I'd do differently:
[Honest retrospective]

Tech stack: React Native, Expo, SQLite (Drizzle ORM), DuckDB, Cloudflare Workers`,
    tags: ["Technical", "r/reactnative", "Bi-weekly"],
  },
]

export const X_TEMPLATES: ContentTemplate[] = [
  {
    id: "x-stock-intelligence",
    title: "Stock Intelligence",
    description:
      "Data-driven stock insight. Lead with numbers, end with what most miss.",
    copyText: `[Stock] debt-to-market-cap: [X]%
Sharia threshold: 30%

[One sentence on what this means — close to threshold, just crossed, etc.]

This is why screening isn't a one-time thing.`,
    tags: ["Stock Intelligence", "3x/week"],
  },
  {
    id: "x-builder-journey",
    title: "Builder Journey",
    description:
      "Behind-the-scenes of building Laak. Honest, transparent, human.",
    copyText: `Week [X] of building Laak.

[What you shipped or learned this week]

The hardest part: [honest challenge]

[What's next or what you're thinking about]`,
    tags: ["Builder Journey", "1-2x/week"],
  },
  {
    id: "x-privacy-take",
    title: "Privacy Take",
    description: "Hot take on data privacy in fintech. Punchy, opinionated.",
    copyText: `Your brokerage app knows more about your finances than your spouse.

Your investment tracker shouldn't need your brokerage login.

Laak stores everything on your phone. Period.`,
    tags: ["Privacy", "1x/week"],
  },
  {
    id: "x-community-poll",
    title: "Community Poll / Engagement",
    description: "Polls, questions, engagement drivers. Get people talking.",
    copyText: `Genuine question for Muslim investors:

Do you check compliance BEFORE or AFTER you're interested in a stock?

(Building something based on the answer)`,
    tags: ["Engagement", "2x/week"],
  },
]

/* ── Content type options for post log ───────────────────── */

export const CONTENT_TYPES = [
  "Comment",
  "Educational Post",
  "Comparison Post",
  "Privacy Post",
  "Builder Story",
  "AMA",
  "Technical Deep-Dive",
  "Stock Tweet",
  "Builder Tweet",
  "Privacy Tweet",
  "Poll / Engagement",
  "Thread",
  "Reply / QT",
  "Other",
] as const
