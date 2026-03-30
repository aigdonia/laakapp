import { createMiddleware } from "hono/factory";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Env } from "../index";

/**
 * Route prefixes where GET requests are public (reference/content data).
 * All other methods (POST/PUT/DELETE) and unlisted routes require auth.
 */
const PUBLIC_GET_PREFIXES = [
  "/countries",
  "/stocks",
  "/screening-rules",
  "/article-categories",
  "/articles",
  "/micro-lessons",
  "/learning-cards",
  "/languages",
  "/credit-packages",
  "/affiliates",
  "/prompts",
  "/asset-classes",
  "/lookups",
  "/app-settings",
  "/ui-translations",
  "/onboarding-screens",
  "/portfolio-presets",
  "/exchange-rates",
  "/stock-compliance",
  "/stock-financials",
  "/data-sources",
  "/event-types",
  "/activity-rules",
];

/**
 * Supabase JWKS endpoint — ES256 public keys for JWT verification.
 * jose caches the keyset automatically.
 */
const SUPABASE_JWKS_URL = "https://jkkprobjmqwoethrpxyh.supabase.co/auth/v1/.well-known/jwks.json";
const jwks = createRemoteJWKSet(new URL(SUPABASE_JWKS_URL));

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const method = c.req.method;
  const path = c.req.path;

  // Health check is always public
  if (path === "/" && method === "GET") {
    return next();
  }

  // Public GET routes for reference/content data
  if (method === "GET") {
    const isPublic = PUBLIC_GET_PREFIXES.some((prefix) =>
      path.startsWith(prefix)
    );
    if (isPublic) return next();
  }

  // All other routes require auth (JWT or admin API key)
  const authHeader = c.req.header("Authorization");

  // Admin API key — trusted internal tools (admin dashboard)
  if (authHeader === `Bearer ${c.env.ADMIN_API_KEY}`) {
    c.set("userId", "admin");
    return next();
  }

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "missing_token" }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const { payload } = await jwtVerify(token, jwks);
    c.set("userId", payload.sub!);
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : "unknown";
    console.error(`[auth] JWT verification failed: ${errMsg}`);
    return c.json({ error: "invalid_token" }, 401);
  }

  return next();
});
