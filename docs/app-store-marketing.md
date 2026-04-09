# Laak — App Store Marketing Guidelines & Launch Plan

> How to properly promote Laak's App Store presence, stay compliant with Apple's guidelines, and integrate with the existing social launch strategy.

---

## Part 1: Apple Marketing Compliance

### Required: App Store Badge Usage

Apple requires specific badge usage when linking to the App Store.

**Official badge:** "Download on the App Store" (black badge with Apple logo)

**Where to get it:** Apple Marketing Resources — developer.apple.com/app-store/marketing/guidelines/

**Rules:**
- Use only the official badge — never recreate, recolor, or modify it
- Minimum clear space: 1/4 badge height on all sides
- Minimum height: 10mm (print) / 40px (digital)
- Badge must link directly to the App Store product page
- Always use the localized version for non-English marketing (Arabic badge for Arabic content)

### Trademark Rules

| Do | Don't |
|---|---|
| "Available on the App Store" | "Available on Apple's App Store" (possessive) |
| "Download on the App Store" (badge) | "Get it on the Apple Store" (wrong name) |
| Refer to "App Store" as a proper noun | Use "app store" lowercase |
| Credit "Apple", "iPhone", "iPad" as trademarks | Imply Apple endorses or sponsors Laak |
| Use product names as adjectives: "iPhone app" | Use as nouns: "available for iPhones" (plural) |

### Screenshot Rules for Marketing

- Screenshots used in marketing materials must match the current live App Store version
- Don't add device frames that don't match current Apple hardware
- Don't overlay marketing text that obscures the actual UI
- If showing the app in a device mockup, use official Apple product images

---

## Part 2: Marketing Assets Checklist

### Must-Have (Before Any Public Marketing)

- [ ] **App Store badge** — Download official badge from Apple Marketing Resources
- [ ] **App Store link** — Direct link: `https://apps.apple.com/app/id6761325373`
- [ ] **QR code** — Generate QR pointing to App Store link (for print, social bios)
- [ ] **Social media banner** — App icon + "Download on the App Store" badge + one screenshot
- [ ] **App Store short link** — Set up vanity URL if available (e.g., laak.app/download redirects to App Store)

### Nice-to-Have (Week 2-4)

- [ ] **Press kit page** — App icon (1024px), 3-5 screenshots, one-paragraph description, App Store link
- [ ] **Device mockup images** — App in iPhone frame for social/web (use Apple's official frames)
- [ ] **Open Graph image** — For link previews when sharing laak.app on social
- [ ] **Email signature badge** — Small App Store badge for email signatures

### Future (Month 2+)

- [ ] **App Preview video** — 15-30 second video showing key flows (portfolio > analysis > screening)
- [ ] **Arabic marketing assets** — Localized badge, screenshots with Arabic overlays
- [ ] **Landing page update** — Full product page at laak.app with App Store badge

---

## Part 3: Launch Announcement — Social Integration

> Ties into the existing strategy in `docs/social-market.md`. This section covers the App Store-specific launch moment.

### Launch Day Posts

**Reddit — "I Built This" (r/SideProject, one-time)**
```
Title: "I built a privacy-first investment companion with AI stock analysis — it just launched on the App Store"

Body:
- Why I started: every investment app wants your broker login and email
- What it does: AI-powered stock analysis, portfolio tracking, Sharia compliance screening
- The privacy angle: everything stays on your device, no account needed
- What makes it different: real financial analysis, not just pass/fail screening
- Screenshots (2-3 key screens)
- [App Store badge + link]

Tone: Builder sharing their work, not selling. Honest about scope (3 markets).
```

**Reddit — Pain Point (r/islamicfinance, r/muslimfinance)**
```
Title: "I was frustrated that halal screening apps charge $25/mo for pass/fail labels — so I built something different"

Body:
- The problem: expensive subscriptions for basic compliance labels, no actual financial analysis
- What Laak does differently: AI deep analysis, pay-per-use credits, privacy-first
- Honest comparison: 3 markets deep vs competitors' 100 markets shallow
- [App Store link, no badge needed — keep it casual]

Tone: Community member sharing a solution, not a company launching a product.
```

**X (Twitter) — Launch Thread**
```
Tweet 1: "Laak is live on the App Store.

An investment companion that actually analyzes stocks — not just labels them halal or haram.

AI-powered. Private. Pay only when you need it.

[Screenshot + App Store link]"

Tweet 2: "What makes it different:
- AI deep analysis (financial health, not just compliance)
- Everything on your device (no account, no broker linking)
- Credits, not subscriptions ($25/mo for screening is insane)
- US, Egypt, and Saudi markets — deep, not wide"

Tweet 3: "Built this because I wanted an investor friend, not a compliance checkbox.

If you invest and care about what you own — give it a look.

[App Store link]"
```

### Post-Launch Content Calendar (Week 1-4)

| Week | Platform | Content | Goal |
|---|---|---|---|
| 1 | Reddit (Tier 1) | Launch announcement + "I Built This" | Initial awareness |
| 1 | X | Launch thread (3 tweets) | Shareability |
| 2 | Reddit (Tier 1) | Educational: "How to evaluate stock financial health" | Value-first, build karma |
| 2 | X | Screenshot of AI analysis output | Show the product in action |
| 3 | Reddit (r/privacy) | "Why do investment apps need your broker login?" | Privacy audience reach |
| 3 | X | Privacy angle: "Your portfolio stays on your phone" | Brand positioning |
| 4 | Reddit (Tier 1) | Comparison post: Laak vs competitors on pricing | Competitive positioning |
| 4 | X | User testimonial or metric (if available) | Social proof |

### Promotional Text Rotation (App Store Connect)

The Promotional Text field (170 chars) can be updated without an app review. Use it for timely messaging:

| Timing | Text |
|---|---|
| Launch | "Your private investment companion. AI-powered stock analysis, portfolio tracking, and Sharia screening — all on your device. No account needed." |
| Week 3 | "See what your stocks are really worth. Deep AI analysis breaks down financial health, revenue quality, and compliance — in plain language." |
| Ramadan | "Zakat and purification calculations built in. Know exactly what you owe — per share, per holding. Private. On your device." |
| New market | "Now covering [Market] stocks. Deep AI analysis for every listed company." |

---

## Part 4: App Store Ratings & Reviews Strategy

### When to Prompt for Ratings

Apple allows `SKStoreReviewController.requestReview()` up to 3 times per 365-day period per device. Apple controls whether the prompt actually shows.

**Best moments to trigger (high-satisfaction points):**
1. After user completes their first AI stock analysis (value delivered)
2. After user's portfolio passes a milestone (e.g., 5 stocks tracked)
3. After a positive insight notification (user feels good about the app)

**Never trigger:**
- During onboarding
- After a failed action or error
- After a credit purchase (feels transactional)
- When the user is in settings or doing housekeeping

### Responding to Reviews

- Respond to every 1-3 star review within 48 hours
- Be helpful, not defensive — "Thanks for the feedback. We're looking into [specific issue]."
- For feature requests: "Great idea — we're tracking this for a future update."
- For bugs: "Sorry about that. Can you email laak@olanai.tech so we can debug?"
- Never argue. Never explain away a valid complaint.

---

## Part 5: App Store Product Page Optimization

### Current Screenshots (5 screens)

1. Portfolio/Stocks screen
2. Insights
3. Credits system
4. Security/Lock
5. Settings

### Optimization Recommendations

- **Reorder for conversion**: Lead with the most compelling screen (AI Analysis or Portfolio overview)
- **Add text overlays**: Short benefit headline above each screenshot (matches ASO benefits)
- **Consider 3 screenshots for launch**: Apple shows 3 in search results — make those 3 count
- **First screenshot is everything**: It's the only one most people see in search results

### Suggested Screenshot Order (optimized)

1. **AI Stock Analysis** — "Understand Every Stock" (hook: this is what competitors don't do)
2. **Portfolio Overview** — "Track Your Wealth" (proof: the app does real work)
3. **Privacy/Lock** — "Your Data, Your Device" (trust: the privacy differentiator)
4. Compliance Screening — "Screen for Sharia" (qualifier: for the target audience)
5. Portfolio Health — "Check Your Score" (depth: there's more to explore)

---

## Quick Reference

| Asset | Status | Location |
|---|---|---|
| App Store screenshots | Exists | `app-store/` and `screenshots/` |
| App icon (1024px) | Exists | `app-store/icon-1024x1024.png` |
| Feature graphic | Exists | `images/feature-graphic.png` |
| Brand assets | Exists | `images/laak-brand.zip` |
| Social strategy | Exists | `docs/social-market.md` |
| ASO metadata | New | `docs/aso-metadata.md` |
| ASO keywords | New | `docs/aso-keywords.md` |
| Analytics playbook | New | `docs/app-store-analytics-playbook.md` |
| Apple marketing badge | Needed | Download from Apple |
| App Preview video | Planned | Not yet created |
