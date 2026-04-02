import { createMiddleware } from "hono/factory";
import type { Env } from "../index";

/**
 * Adds standard security headers to all responses.
 * Cloudflare Workers enforce HTTPS, so HSTS reinforces this at the browser level.
 */
export const securityHeaders = createMiddleware<Env>(async (c, next) => {
  await next();

  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("X-XSS-Protection", "0");
  c.header(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
});
