import { createMiddleware } from "hono/factory";
import { jwtVerify } from "jose";
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

  // All other routes require a valid JWT
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "missing_token" }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const secret = new TextEncoder().encode(c.env.SUPABASE_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    c.set("userId", payload.sub!);
  } catch {
    return c.json({ error: "invalid_token" }, 401);
  }

  return next();
});
