# Security Assessment Report — Laak (fin-ai)

**Date:** 2026-03-28 | **Scope:** Full monorepo (mobile, API, admin, web)

---

## Executive Summary

The privacy-first architecture (on-device data, anonymous UUIDs, no PII) is a strong foundation. However, the **API layer has critical authentication gaps** that would allow anyone to manipulate the entire database, spoof user identities, and abuse the credit system. The mobile app needs encryption hardening for on-device storage.

**Totals:** 7 Critical | 8 High | 14 Medium | 6 Low

---

## CRITICAL Findings (Fix Before Production)

| # | Finding | File | Risk |
|---|---------|------|------|
| C1 | **No authentication on ANY API route** — all 25+ CRUD endpoints (countries, stocks, articles, screening rules, etc.) are publicly writable/deletable | `api/src/routes/_crud.ts` | Anyone can corrupt/delete all data |
| C2 | **Customer ID spoofable** — credit spend uses `X-RC-Customer-Id` header with no verification | `api/src/routes/credits.ts:22` | Attacker drains any user's credits |
| C3 | **Notification endpoints unauthenticated** — anyone can create campaigns and send push to all users | `api/src/routes/notifications.ts:63-142` | Mass spam, phishing via deepLink |
| C4 | **Push token hijacking** — register tokens for any userId, receive their notifications, delete their tokens | `api/src/routes/push-tokens.ts:14-87` | Notification interception |
| C5 | **Zero input validation** — all POST/PUT accept arbitrary JSON, directly inserted into DB | `api/src/routes/_crud.ts:37-38` | Data injection, schema corruption |
| C6 | **SQLite databases unencrypted** — user-data.db with portfolio holdings stored in plaintext | `mobile/src/db/user-db.ts:6` | Full data exposure on rooted devices |
| C7 | **Wildcard CORS** — `cors()` with no params allows any origin | `api/src/index.ts:37` | Cross-origin attacks on all endpoints |

---

## HIGH Findings

| # | Finding | File | Risk |
|---|---------|------|------|
| H1 | **No rate limiting** on any endpoint | All routes | Brute force, DoS, credit exhaustion |
| H2 | **MMKV storage unencrypted** — app lock settings, brute-force counters accessible | `mobile/src/store/app-lock.ts:5` | Bypass app lock on rooted devices |
| H3 | **Deep links unvalidated** — `halalwealth://` scheme accepts arbitrary routes/params | `app.json:8`, Android/iOS manifests | Navigation hijacking, phishing |
| H4 | **RevenueCat API key scope** — `EXPO_PUBLIC_REVENUECAT_API_KEY` bundled in app | `mobile/src/lib/purchases.ts:6` | Verify key is read-only SDK scope |
| H5 | **Push token errors logged with sensitive data** | `mobile/src/lib/notifications.ts:59,76,88` | Token/user ID leaks to crash services |
| H6 | **Android cleartext traffic enabled** in debug manifests | `android/app/src/debug/AndroidManifest.xml:6` | Risk if accidentally shipped to prod |
| H7 | **No security headers** — missing HSTS, X-Frame-Options, CSP, X-Content-Type-Options | `api/src/index.ts` | Standard hardening missing |
| H8 | **Deprecated deps with known vulns** — glob@7.2.3, inflight@1.0.6 (memory leak) | `pnpm-lock.yaml` | Supply chain risk |

---

## MEDIUM Findings

| # | Finding | File | Risk |
|---|---------|------|------|
| M1 | **PIN hashed with SHA256** instead of bcrypt/argon2 — no iterations, GPU-crackable | `mobile/src/lib/pin.ts:17-22` | Weak PIN protection |
| M2 | **No certificate pinning** — MITM possible via compromised CA | `mobile/src/lib/api.ts` | Data interception |
| M3 | **Redacted amounts use `opacity: 0`** — content still accessible via accessibility APIs | `mobile/src/components/portfolio/redacted.tsx` | Hidden values extractable |
| M4 | **No screenshot/screen recording protection** | Not implemented | Portfolio values capturable |
| M5 | **UUID is sole auth identifier** — no secondary verification | `mobile/src/lib/uuid.ts:7-8` | If compromised, full account access |
| M6 | **No CI/CD security pipeline** — no automated audit, lint, or secret scanning | No `.github/workflows/` | Manual-only security checks |
| M7 | **No audit logging** for mutations | All API routes | No incident response trail |
| M8 | **JS bundle not obfuscated** — API endpoints, auth logic reverse-engineerable | Build config | Client logic exposed |
| M9 | **No clipboard clearing** for sensitive data | Not implemented | Portfolio data persists in clipboard |
| M10 | **No payload size limits** on bulk endpoints | `api/src/routes/ui-translations.ts:64-116` | DoS via large payloads |
| M11 | **Error responses may leak internals** | `api/src/routes/notifications.ts:262` | Info disclosure |
| M12 | **Production DB ID in version control** | `api/wrangler.toml:22` | Attack surface info |
| M13 | **RevenueCat/Expo SDKs send analytics** to third-party servers | `package.json` | Privacy consideration for Muslim-focused app |
| M14 | **No data export API** for GDPR right to portability | Not implemented | Compliance gap |

---

## LOW Findings

| # | Finding | File | Risk |
|---|---------|------|------|
| L1 | iOS allows local networking | `ios/Laak/Info.plist:45-46` | Minimal, dev convenience |
| L2 | Biometric auto-trigger 300ms delay race condition | `mobile/src/components/app-lock/lock-screen.tsx:67` | Theoretical timing attack |
| L3 | No deepLink URL validation in notifications | `api/src/routes/notifications.ts:68` | Phishing links possible |
| L4 | Feature cost lookup fails if cost is 0 | `api/src/routes/credits.ts:28` | Logic error |
| L5 | Temp SQL file in db:push script | `api/package.json:17` | Data on disk if interrupted |
| L6 | React Query caches sensitive data in memory | `package.json` | Requires device compromise |

---

## Positive Findings

- No hardcoded secrets in codebase
- Secrets managed via Cloudflare Workers bindings
- OTA updates disabled in production
- `__DEV__` flag properly gates dev/prod behavior
- `.gitignore` properly excludes `.env*`, `.pem`, `.key`
- Drizzle ORM provides parameterized queries (mitigates SQL injection)
- SecureStore used for UUID storage
- Biometric `disableDeviceFallback: true` prevents passcode fallback
- Minimal PII collection (privacy-by-design)
- Test key detection prevents RevenueCat test keys in production
- No WebView usage (eliminates XSS attack surface)
- Lock file (`pnpm-lock.yaml`) exists for reproducible builds

---

## Detailed Analysis

### API Authentication & Authorization

The API (`apps/api`) built on Hono + Cloudflare Workers has **zero authentication**. The generic CRUD router at `_crud.ts` creates GET/POST/PUT/DELETE endpoints for every table without any auth middleware.

**Affected routes (all unauthenticated):**
- `/countries`, `/stocks`, `/affiliates`, `/articles`, `/asset-classes`
- `/article-categories`, `/credit-packages`, `/onboarding-screens`
- `/portfolio-presets`, `/screening-rules`, `/app-settings`
- `/notifications`, `/push-tokens`, `/credits`, `/ui-translations`
- And 10+ more CRUD resource routes

**Attack scenarios:**
1. Attacker calls `DELETE /stocks/:id` — removes stock data for all users
2. Attacker calls `POST /notifications` then `POST /notifications/:id/send` — spam all users
3. Attacker calls `POST /credits/spend` with spoofed `X-RC-Customer-Id` — drains victim credits
4. Attacker calls `PUT /screening-rules/:id` — corrupts Sharia compliance data
5. Attacker calls `POST /push-tokens` with victim's userId — hijacks notifications

### API Input Validation

Every POST/PUT endpoint accepts raw JSON with no schema validation:

```typescript
// _crud.ts - pattern used across all routes
app.post("/", async (c) => {
  const body = await c.req.json();  // No validation
  const row = await db(c).insert(table).values(body).returning().get();
  return c.json(row, 201);
});
```

This allows:
- Arbitrary fields injected into database rows
- Missing required fields causing silent failures
- Invalid data types bypassing business logic
- Potential ORM-level injection if Drizzle has edge cases

### Mobile Data Storage

**SQLite (`user-data.db`):** Contains transactions, holdings, portfolio data — stored unencrypted via `openDatabaseSync('user-data.db')`. On rooted/jailbroken devices, this file is directly readable.

**MMKV Storage:** App lock settings (`appLockEnabled`, `lockMethod`, `failedAttempts`, `lockoutUntil`) stored in unencrypted MMKV. An attacker with file access can:
- Disable app lock by setting `appLockEnabled: false`
- Reset brute-force counters (`failedAttempts: 0`)
- Bypass lockout by clearing `lockoutUntil`

**PIN Security:** SHA256 hash with salt — but SHA256 is not a password-hashing algorithm. A 4-6 digit PIN has only 10,000-1,000,000 combinations. With SHA256's speed (~3 billion/sec on GPU), all PINs crackable in under 1ms.

### CORS Configuration

```typescript
// api/src/index.ts:37
app.use("*", cors());
```

Default Hono `cors()` allows all origins, all methods, all headers. Combined with no authentication, any website can make requests to the API.

### Network Security

- Production uses HTTPS (Cloudflare Workers enforce it)
- No certificate pinning — vulnerable to MITM via compromised CA or corporate proxy
- Development correctly uses `http://localhost` gated by `__DEV__`
- Android debug manifests enable cleartext traffic (acceptable for debug only)

### Deep Link Security

Custom scheme `halalwealth://` registered on both iOS and Android with no route validation. Any app on the device can open arbitrary routes in Laak:

```xml
<!-- AndroidManifest.xml -->
<intent-filter>
  <action android:name="android.intent.action.VIEW"/>
  <data android:scheme="halalwealth"/>
</intent-filter>
```

Routes like `/holding/[id]` accept parameters without validation, enabling navigation to arbitrary screens.

### Third-Party SDK Privacy

For a privacy-focused Muslim finance app, note these data flows:
- **RevenueCat:** Purchase history, subscription data sent to RevenueCat servers
- **Expo Notifications:** Push tokens sent to Expo relay servers
- **Expo Updates:** Disabled (good)

---

## Remediation Roadmap

### Phase 0 — Production Blockers

1. **Add API authentication middleware** — protect all CRUD routes with API key or JWT
2. **Validate customer identity** on `/credits/spend` — verify `X-RC-Customer-Id` server-side via RevenueCat
3. **Restrict CORS** to known origins
4. **Add input validation** (Zod schemas) to every POST/PUT endpoint
5. **Authenticate push token endpoints** — verify userId matches caller

### Phase 1 — High Priority (Before Public Launch)

6. **Add rate limiting** (Cloudflare or hono-rate-limiter)
7. **Encrypt SQLite** with SQLCipher
8. **Encrypt MMKV** storage with derived key
9. **Replace SHA256 PIN hashing** with bcrypt/argon2 + proper cost factor
10. **Sanitize error logs** — strip sensitive data before logging
11. **Add security headers** middleware (HSTS, X-Frame-Options, CSP, X-Content-Type-Options)
12. **Validate deep link routes** — whitelist allowed paths

### Phase 2 — Hardening (Post-Launch)

13. Implement certificate pinning
14. Add screenshot protection (`expo-screen-capture`)
15. Fix `Redacted` component — don't render hidden content at all (replace `opacity: 0` with conditional render)
16. Add audit logging for all mutations
17. Set up CI/CD with `pnpm audit` + secret scanning (GitHub Actions)
18. Update deprecated dependencies (glob, rimraf, inflight)
19. Obfuscate JS bundle (Hermes + jscrambler)
20. Add data export API for GDPR compliance
21. Implement clipboard auto-clearing for sensitive data
