import { createMiddleware } from "hono/factory";
import type { Env } from "../index";

/**
 * Simple in-memory per-user rate limiter.
 * Resets on Worker cold start — best-effort throttle, not a security wall.
 * Auth middleware is the real gate.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (maxRequests: number, windowMs = 60_000) =>
  createMiddleware<Env>(async (c, next) => {
    const userId = c.get("userId");

    // Admin is exempt
    if (userId === "admin") return next();

    const key = `${userId}:${c.req.path}`;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      return c.json({ error: "rate_limited", retryAfterMs: entry.resetAt - now }, 429);
    }

    entry.count++;
    return next();
  });
