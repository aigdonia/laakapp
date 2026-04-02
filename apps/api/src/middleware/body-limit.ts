import { createMiddleware } from "hono/factory";
import type { Env } from "../index";

const DEFAULT_MAX_BODY = 1 * 1024 * 1024; // 1 MB

/**
 * Rejects requests with Content-Length exceeding the limit.
 * Individual routes can override by checking before this middleware runs.
 */
export const bodyLimit = (maxBytes = DEFAULT_MAX_BODY) =>
  createMiddleware<Env>(async (c, next) => {
    const contentLength = c.req.header("content-length");
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      return c.json(
        { error: "payload_too_large", maxBytes },
        413
      );
    }
    await next();
  });
