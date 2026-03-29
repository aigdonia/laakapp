const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
];

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function jitter(baseMs: number): number {
  const factor = 0.7 + Math.random() * 0.6; // ±30%
  return Math.round(baseMs * factor);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface FetchOptions {
  rateLimitMs?: number;
  maxRetries?: number;
  headers?: Record<string, string>;
}

export interface FetchResult<T> {
  ok: boolean;
  data?: T;
  status?: number;
  error?: string;
}

/**
 * Fetch with retry, jittered delay, and UA rotation.
 * Returns parsed JSON or error.
 */
export async function fetchWithRetry<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  const { rateLimitMs = 3000, maxRetries = 3 } = options;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": randomUA(),
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          ...options.headers,
        },
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : rateLimitMs * Math.pow(3, attempt + 1);
        console.log(
          `[fetch] Rate limited, waiting ${waitMs}ms (attempt ${attempt + 1})`
        );
        await sleep(waitMs);
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("json")) {
        const data = (await response.json()) as T;
        return { ok: true, data, status: response.status };
      }

      // Return raw text as data for HTML parsing
      const text = await response.text();
      return { ok: true, data: text as unknown as T, status: response.status };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(
        `[fetch] Attempt ${attempt + 1}/${maxRetries} failed: ${msg}`
      );

      if (attempt < maxRetries - 1) {
        const backoff = rateLimitMs * Math.pow(3, attempt); // 3s, 9s, 27s
        await sleep(jitter(backoff));
      } else {
        return { ok: false, error: msg };
      }
    }
  }

  return { ok: false, error: "Max retries exceeded" };
}

/**
 * Circuit breaker: tracks consecutive failures for a job.
 * Returns true if the job should be aborted.
 */
export class CircuitBreaker {
  private consecutiveFailures = 0;
  private readonly threshold: number;

  constructor(threshold = 5) {
    this.threshold = threshold;
  }

  recordSuccess() {
    this.consecutiveFailures = 0;
  }

  recordFailure(): boolean {
    this.consecutiveFailures++;
    return this.consecutiveFailures >= this.threshold;
  }

  get isOpen(): boolean {
    return this.consecutiveFailures >= this.threshold;
  }
}

/**
 * Add jittered delay between requests.
 */
export async function rateLimitDelay(baseMs: number): Promise<void> {
  await sleep(jitter(baseMs));
}
