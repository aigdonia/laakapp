# Laak — App Store Keywords Strategy

> Apple allows exactly 100 characters for keywords. Comma-separated, no spaces after commas.
> Keywords in the app name and subtitle are already indexed — do NOT repeat them here.

---

## Already Indexed (from Name + Subtitle)

These words are automatically searchable — excluded from the 100-char keyword field:

| Source | Words Indexed |
|---|---|
| App Name: "Laak — Investment Companion" | laak, investment, companion |
| Subtitle: "AI Stock Analysis & Privacy" | ai, stock, analysis, privacy |

---

## Keyword Field (100 chars)

### Recommended Set

```
halal,investing,portfolio,tracker,sharia,screening,finance,islamic,wealth,zakat,purification,stocks
```
(100 chars exactly)

### Rationale

| Keyword | Why Included | Expected Competition |
|---|---|---|
| halal | Core differentiator, high-intent niche search | Low-Medium |
| investing | Broad investment intent, pairs with "halal investing" | High |
| portfolio | Portfolio tracker searches, high volume | High |
| tracker | Completes "portfolio tracker", "stock tracker" | Medium |
| sharia | Niche but high-intent Muslim investor searches | Low |
| screening | Completes "sharia screening", "stock screening" | Low |
| finance | Broad category, "islamic finance", "personal finance" | High |
| islamic | "Islamic finance", "islamic investing" — niche qualifier | Low |
| wealth | "Wealth tracker", "wealth management" — aspirational | Medium |
| zakat | High-intent, seasonal spikes (Ramadan), no good alternatives | Low |
| purification | Unique to Islamic finance apps, zero competition | Very Low |
| stocks | Broad search, "halal stocks", complements "stock" (singular) from subtitle | High |

---

## Keywords NOT Included (and why)

| Keyword | Reason Excluded |
|---|---|
| stock, ai, analysis, privacy, investment | Already in name/subtitle — Apple indexes these automatically |
| halal investing app | Apple combines words — "halal" + "investing" covers this |
| calculator | Lower priority; "analysis" (in subtitle) is stronger |
| muslim | Could limit broad appeal; "islamic" + "halal" covers the audience |
| haram | Negative framing — users search for "halal", not "haram" |
| compliant | Low search volume; "screening" is what users actually search |
| dividends | Not a core feature yet |
| budgeting | Phase 2 feature (Laak Manager), not yet live |
| free | Apple discourages; doesn't help ranking meaningfully |

---

## Compound Search Terms Created

Apple's algorithm combines keywords from name, subtitle, and keyword field. These compound searches are now matchable:

- "halal investing" (halal + investing)
- "halal stocks" (halal + stocks)
- "islamic finance" (islamic + finance)
- "portfolio tracker" (portfolio + tracker)
- "sharia screening" (sharia + screening)
- "stock screening" (stock + screening)
- "halal stock analysis" (halal + stock + analysis)
- "zakat calculator" (zakat + name association)
- "private portfolio tracker" (privacy + portfolio + tracker)
- "AI stock analysis" (ai + stock + analysis — from subtitle)
- "wealth tracker" (wealth + tracker)
- "investment tracker" (investment + tracker)

---

## Alternative Keyword Sets

### If "purification" underperforms (swap for broader term):
```
halal,investing,portfolio,tracker,sharia,screening,finance,islamic,wealth,zakat,calculator,stocks
```
(swaps "purification" for "calculator" — 99 chars)

### If targeting broader audience (less Islamic-specific):
```
halal,investing,portfolio,tracker,sharia,screening,finance,wealth,private,calculator,stocks,budget
```
(swaps "islamic"+"purification"+"zakat" for "private"+"calculator"+"budget" — 100 chars)

---

## Optimization Cadence

| When | Action |
|---|---|
| Week 2 | Check App Analytics → Sources → Search Terms for actual discovery keywords |
| Week 4 | First keyword swap if any term has zero impressions |
| Monthly | Review search term report, rotate lowest performers |
| Ramadan season | Ensure "zakat" and "purification" are included (seasonal spike) |

---

## Notes

- Keywords are re-indexable with each app update (no review needed for keyword changes alone — but requires a new version submission)
- Apple Search Ads (when activated) will show keyword popularity scores — use that data to refine
- Singular vs plural: Apple handles both, but including "stocks" alongside subtitle's "stock" adds a small signal
- Localized keywords (Arabic) should be added when Arabic metadata is created
