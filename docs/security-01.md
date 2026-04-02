# Security Assessment Report — Laak (fin-ai)

**Original Date:** 2026-03-28 | **Revised:** 2026-04-02 | **Scope:** Full monorepo (mobile, API, admin, web)

---

## Executive Summary

Since the original assessment, **significant progress** has been made on the most critical findings. API authentication is now in place via Supabase JWT + admin API key, customer identity spoofing is resolved, and screenshot protection has been added. However, **input validation remains absent across all endpoints**, on-device encryption (SQLite, MMKV) is still missing, and there is no CI/CD security pipeline.

**Original Totals:** 7 Critical | 8 High | 14 Medium | 6 Low
**Current Status:** 5 Fixed | 5 Partially Fixed | 20 Remaining | 5 No Longer Applicable

---

## CRITICAL Findings — Status

| # | Finding | Status | Notes |
|---|---------|--------|-------|
| C1 | **No authentication on ANY API route** | ✅ **FIXED** | JWT auth via Supabase JWKS (`middleware/auth.ts`). Public GETs for reference data, all POST/PUT/DELETE require auth. Admin API key fallback for internal tools. |
| C2 | **Customer ID spoofable** via `X-RC-Customer-Id` | ✅ **FIXED** | Now uses `c.get("userId")` from JWT middleware. RevenueCat balance verified server-side before debits. Idempotency via `txId`. |
| C3 | **Notification endpoints unauthenticated** | ✅ **FIXED** | All notification CRUD now behind auth middleware. |
| C4 | **Push token hijacking** | ✅ **FIXED** | Push token routes authenticated. Uses `c.get("userId")` to bind tokens to authenticated user. |
| C5 | **Zero input validation** | ❌ **REMAINING** | Still no Zod or runtime validation on any POST/PUT endpoint. All routes accept raw `c.req.json()`. Drizzle ORM prevents SQL injection but arbitrary fields, missing fields, and type confusion still possible. |
| C6 | **SQLite databases unencrypted** | ❌ **REMAINING** | `user-data.db` still opened via `openDatabaseSync('user-data.db')` without encryption. Portfolio holdings, transactions, analyses all plaintext on disk. |
| C7 | **Wildcard CORS** | ⚠️ **PARTIALLY FIXED** | Still using `cors()` with no origin restriction. However, with auth now in place, the risk is reduced from Critical to **Medium** — CORS alone can't bypass JWT. Should still restrict to known origins. |

---

## HIGH Findings — Status

| # | Finding | Status | Notes |
|---|---------|--------|-------|
| H1 | **No rate limiting** | ⚠️ **PARTIALLY FIXED** | Activity route has custom DB-backed rate limiting (1 event/type/60s, 50/day/user). All other routes still have no rate limiting. No global middleware. |
| H2 | **MMKV storage unencrypted** | ❌ **REMAINING** | All MMKV instances (`app-lock`, `preferences`, `onboarding`, `credits`, `notifications`) created without encryption. Brute-force counters still unprotected. |
| H3 | **Deep links unvalidated** | ❌ **REMAINING** | `halalwealth://` scheme still accepts arbitrary routes/params. No allowlist or validation in API or mobile. |
| H4 | **RevenueCat API key scope** | ⚠️ **ACCEPTABLE** | Key is a test key with runtime check (`isTestKey`) preventing use in Release builds. `.env` files are properly gitignored and not tracked. Production key managed via build secrets. |
| H5 | **Push token errors logged with sensitive data** | ✅ **FIXED** | Error logging no longer includes push tokens. Only error objects logged, not token values. |
| H6 | **Android cleartext traffic** in debug manifests | ⚠️ **ACCEPTABLE** | Debug-only configuration. Production builds use strict HTTPS. iOS has `NSAllowsArbitraryLoads: false`. |
| H7 | **No security headers** | ❌ **REMAINING** | No HSTS, X-Frame-Options, CSP, or X-Content-Type-Options middleware added. Cloudflare provides some defaults but explicit headers still missing. |
| H8 | **Deprecated deps with known vulns** | ❌ **REMAINING** | `glob@7.2.3`, `inflight@1.0.6`, `rimraf@3.0.2` still present in lockfile. |

---

## MEDIUM Findings — Status

| # | Finding | Status | Notes |
|---|---------|--------|-------|
| M1 | **PIN hashed with SHA256** | ❌ **REMAINING** | Still using `Crypto.CryptoDigestAlgorithm.SHA256` with salt. Not bcrypt/argon2. PIN stored in SecureStore (good) but hashing algorithm is weak for brute-force resistance. |
| M2 | **No certificate pinning** | ❌ **REMAINING** | Standard TLS only. No TrustKit or similar. |
| M3 | **Redacted amounts use `opacity: 0`** | ❌ **REMAINING** | Still rendering content with opacity masking. Accessible via screen readers / view hierarchy inspection. |
| M4 | **No screenshot/screen recording protection** | ✅ **FIXED** | `expo-screen-capture` v55.0.9 integrated. `usePreventScreenCapture()` called in root layout (`app/_layout.tsx`). |
| M5 | **UUID is sole auth identifier** | ✅ **FIXED** | Migrated to Supabase anonymous auth + JWT. Apple Sign-In integrated (`apple-auth.ts`). Sessions stored in SecureStore. Auto-refresh enabled. |
| M6 | **No CI/CD security pipeline** | ❌ **REMAINING** | `.github/workflows/` directory still does not exist. No automated audit, SAST, secret scanning, or dependency checks. |
| M7 | **No audit logging** for mutations | ⚠️ **PARTIALLY FIXED** | Notification delivery logs exist. Activity route has tracking. But no general mutation audit trail (no who-did-what-when for CRUD operations). |
| M8 | **JS bundle not obfuscated** | ❌ **REMAINING** | No obfuscation configured in EAS/Metro. Standard Expo build. |
| M9 | **No clipboard clearing** | ❌ **REMAINING** | No clipboard clearing implementation found. No `expo-clipboard` usage. |
| M10 | **No payload size limits** on bulk endpoints | ⚠️ **PARTIALLY FIXED** | Backups route enforces 10MB limit. UI translations and other bulk endpoints still have no limits. |
| M11 | **Error responses may leak internals** | ❌ **REMAINING** | Not verified as fully resolved. |
| M12 | **Production DB ID in version control** | ❌ **REMAINING** | `database_id = "0b317a07-..."` still in `wrangler.toml`. Should be in CF secrets. |
| M13 | **RevenueCat/Expo SDKs send analytics** | ❌ **REMAINING** | Inherent to SDK usage. Privacy policy should disclose. |
| M14 | **No data export API** for GDPR | ⚠️ **PARTIALLY FIXED** | Backup/restore endpoints allow users to export transaction data. But no dedicated GDPR endpoint, no account deletion API, no formal data retention policy. |

---

## LOW Findings — Status

| # | Finding | Status | Notes |
|---|---------|--------|-------|
| L1 | iOS allows local networking | ✅ **FIXED** | `NSAllowsLocalNetworking: false` now set in Info.plist. |
| L2 | Biometric auto-trigger race condition | ❌ **REMAINING** | Not verified as resolved. |
| L3 | No deepLink URL validation in notifications | ❌ **REMAINING** | API stores `deepLink` field without format validation. |
| L4 | Feature cost lookup fails if cost is 0 | ❌ **REMAINING** | Not verified as resolved. |
| L5 | Temp SQL file in db:push script | ❌ **REMAINING** | Not verified as resolved. |
| L6 | React Query caches sensitive data in memory | ❌ **REMAINING** | Inherent to architecture, low risk. |

---

## Positive Findings (Updated)

**Carried forward:**
- No hardcoded secrets in codebase
- Secrets managed via Cloudflare Workers bindings
- OTA updates disabled in production
- `__DEV__` flag properly gates dev/prod behavior
- `.gitignore` properly excludes `.env*`, `.pem`, `.key` — verified `.env` files are not tracked
- Drizzle ORM provides parameterized queries (mitigates SQL injection)
- Biometric `disableDeviceFallback: true` prevents passcode fallback
- Minimal PII collection (privacy-by-design)
- Test key detection prevents RevenueCat test keys in production
- No WebView usage (eliminates XSS attack surface)
- Lock file (`pnpm-lock.yaml`) exists for reproducible builds

**New positives since original assessment:**
- JWT authentication via Supabase JWKS with ES256 signature verification
- Admin API key separation for internal tools
- Supabase anonymous auth replaces bare UUID — sessions in SecureStore
- Apple Sign-In native flow integrated
- Screenshot/screen recording protection via `expo-screen-capture`
- Push token logging sanitized — no sensitive data in error logs
- Backup endpoint enforces 10MB payload limit
- Activity route has DB-backed rate limiting + idempotency
- Credit spending uses server-verified identity with idempotent transactions
- iOS ATS fully enforced (`NSAllowsArbitraryLoads: false`, `NSAllowsLocalNetworking: false`)
- TypeScript strict mode enabled across all apps

---

## Revised Remediation Roadmap

### Phase 0 — Production Blockers (Remaining)

| # | Task | Original | Status |
|---|------|----------|--------|
| 1 | Add API authentication middleware | C1 | ✅ Done |
| 2 | Validate customer identity on credits | C2 | ✅ Done |
| 3 | Restrict CORS to known origins | C7 | ⚠️ Downgraded to Medium — auth mitigates, but should still restrict |
| 4 | **Add input validation (Zod schemas)** | C5 | ❌ **Still Critical** |
| 5 | Authenticate push token endpoints | C4 | ✅ Done |

### Phase 1 — High Priority (Before Public Launch)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 6 | **Add global rate limiting** | HIGH | ⚠️ Partial (activity only) |
| 7 | **Encrypt SQLite with SQLCipher** | CRITICAL | ❌ Not started |
| 8 | **Encrypt MMKV storage** | HIGH | ❌ Not started |
| 9 | Replace SHA256 PIN hashing with bcrypt/argon2 | MEDIUM | ❌ Not started |
| 10 | Sanitize error logs | HIGH | ✅ Done (push tokens) |
| 11 | **Add security headers middleware** | HIGH | ❌ Not started |
| 12 | **Validate deep link routes** | HIGH | ❌ Not started |
| 13 | **Restrict CORS to known origins** | MEDIUM | ❌ Not started |
| 14 | **Move prod DB ID from wrangler.toml to secrets** | MEDIUM | ❌ Not started |

### Phase 2 — Hardening (Post-Launch)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 15 | Implement certificate pinning | MEDIUM | ❌ Not started |
| 16 | Add screenshot protection | MEDIUM | ✅ Done |
| 17 | Fix Redacted component (conditional render) | LOW | ❌ Not started |
| 18 | **Add mutation audit logging** | MEDIUM | ⚠️ Partial |
| 19 | **Set up CI/CD security pipeline** | HIGH | ❌ Not started |
| 20 | Update deprecated dependencies | MEDIUM | ❌ Not started |
| 21 | Obfuscate JS bundle | LOW | ❌ Not started |
| 22 | Add GDPR data export + account deletion API | MEDIUM | ⚠️ Partial (backup exists) |
| 23 | Implement clipboard auto-clearing | LOW | ❌ Not started |

---

## Score Summary

| Category | Fixed | Partial | Remaining |
|----------|-------|---------|-----------|
| Critical (7) | 4 | 1 | 2 |
| High (8) | 1 | 2 | 3 (+2 acceptable) |
| Medium (14) | 2 | 3 | 9 |
| Low (6) | 1 | 0 | 5 |
| **Total (35)** | **8 (23%)** | **6 (17%)** | **19 (54%)** (+2 acceptable, 6%) |

### Top Priority Remaining Items

1. **C5 — Input validation (Zod)** — Critical, affects all POST/PUT endpoints
2. **C6 — SQLite encryption** — Critical, portfolio data plaintext on disk
3. **H7 — Security headers** — Quick win, low effort
4. **M6 — CI/CD pipeline** — Foundation for ongoing security
5. **H1 — Global rate limiting** — Prevents abuse at scale
6. **H3 — Deep link validation** — Prevents navigation hijacking
7. **M12 — Prod DB ID in wrangler.toml** — Quick fix, move to secrets
