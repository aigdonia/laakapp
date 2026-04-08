/**
 * Scrape Runner — standalone Node.js script for processing scrape jobs.
 *
 * Usage: npx tsx scripts/scrape-runner.ts [--api-url http://localhost:12003] [--admin-key <key>]
 *
 * Data sources are per-market (e.g. market-egx, market-tadawul).
 * Each data source has a config: { exchange, tv, sa } that tells the runner
 * which TradingView region and StockAnalysis exchange path to use.
 *
 * Job types:
 *   price_update     — daily: TradingView scanner → /stocks/prices
 *   financial_update  — bi-weekly: TradingView bulk + StockAnalysis fallback → /stock-financials/bulk
 */

import { CircuitBreaker, rateLimitDelay } from "./scrapers/fetch-utils";
import { scrapeStockAnalysis } from "./scrapers/stockanalysis";
import { scrapeTradingViewMarket } from "./scrapers/tradingview";

const API_URL = process.argv.includes("--api-url")
  ? process.argv[process.argv.indexOf("--api-url") + 1]
  : "http://localhost:12003";

const ADMIN_KEY = process.argv.includes("--admin-key")
  ? process.argv[process.argv.indexOf("--admin-key") + 1]
  : process.env.ADMIN_API_KEY ?? "";

const authHeaders: Record<string, string> = ADMIN_KEY
  ? { Authorization: `Bearer ${ADMIN_KEY}` }
  : {};

// ─── Types ───────────────────────────────────────────────────

interface ScrapeJob {
  id: string;
  dataSourceId: string;
  status: string;
  jobType: string;
  targetSymbols: string[] | null;
  progress: {
    total: number;
    completed: number;
    failed: number;
    errors: string[];
  };
}

interface DataSource {
  id: string;
  slug: string;
  type: string;
  rateLimitMs: number;
  maxRetries: number;
  countryCodes: string[];
  config: {
    exchange?: string;
    tv?: string;
    sa?: string;
    minMarketCap?: number;
  };
}

interface Stock {
  id: string;
  symbol: string;
  exchange: string;
  countryCode: string;
}

// ─── API Helpers ─────────────────────────────────────────────

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function apiPut(path: string, body: unknown): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} → ${res.status}`);
}

// ─── Price Update (TradingView) ──────────────────────────────

async function processPriceUpdateJob(job: ScrapeJob, source: DataSource) {
  const exchange = source.config.exchange;
  const tvRegion = source.config.tv;

  if (!exchange || !tvRegion) {
    throw new Error(
      `Data source ${source.slug} missing config.exchange or config.tv`
    );
  }

  await apiPut(`/scrape-jobs/${job.id}`, {
    status: "running",
    startedAt: new Date().toISOString(),
  });

  try {
    const stocks = await scrapeTradingViewMarket(exchange, tvRegion, source.config.minMarketCap);

    if (stocks.length === 0) {
      throw new Error(`No stocks returned from TradingView for ${exchange}`);
    }

    let totalUpdated = 0;
    const BATCH = 100;

    for (let i = 0; i < stocks.length; i += BATCH) {
      const batch = stocks
        .slice(i, i + BATCH)
        .filter((s) => s.close != null)
        .map((s) => ({
          symbol: s.symbol,
          price: s.close!,
          marketCap: s.marketCap,
        }));

      const result = await apiPost<{ updated: number }>(
        "/stocks/prices",
        batch
      );
      totalUpdated += result.updated;
    }

    await apiPut(`/scrape-jobs/${job.id}`, {
      status: "completed",
      completedAt: new Date().toISOString(),
      progress: {
        total: stocks.length,
        completed: totalUpdated,
        failed: stocks.length - totalUpdated,
        errors: [],
      },
    });

    console.log(
      `[runner] Price update done: ${totalUpdated}/${stocks.length} stocks updated`
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[runner] Price update failed: ${msg}`);
    await apiPut(`/scrape-jobs/${job.id}`, {
      status: "failed",
      completedAt: new Date().toISOString(),
      errorMessage: msg,
    });
  }
}

// ─── Financial Update (TradingView + StockAnalysis fallback) ─

async function processFinancialUpdateJob(
  job: ScrapeJob,
  source: DataSource
) {
  const exchange = source.config.exchange;
  const tvRegion = source.config.tv;
  const saExchange = source.config.sa;

  if (!exchange || !tvRegion) {
    throw new Error(
      `Data source ${source.slug} missing config.exchange or config.tv`
    );
  }

  await apiPut(`/scrape-jobs/${job.id}`, {
    status: "running",
    startedAt: new Date().toISOString(),
  });

  try {
    // 1. Fetch bulk data from TradingView
    const tvStocks = await scrapeTradingViewMarket(exchange, tvRegion, source.config.minMarketCap);

    // 2. Get DB stocks to map symbols → IDs
    const dbStocks = await apiGet<{ data: Stock[] }>(
      `/stocks?countries=${source.countryCodes[0]}&limit=1000`
    );
    const symbolToId = new Map(dbStocks.data.map((s) => [s.symbol, s.id]));

    const year = new Date().getFullYear();
    const financialsBatch: Array<Record<string, unknown>> = [];
    const needsSAFallback: Array<{ stockId: string; symbol: string }> = [];

    // 3. Build financials from TradingView data
    for (const tv of tvStocks) {
      const stockId = symbolToId.get(tv.symbol);
      if (!stockId) continue;

      const hasAssets = tv.totalAssets != null;
      const hasDebt = tv.totalDebt != null;

      if (hasAssets || hasDebt || tv.totalRevenue || tv.marketCap) {
        financialsBatch.push({
          stockId,
          fiscalYear: year,
          fiscalPeriod: "annual",
          source: "stockanalysis", // will be overwritten if SA fills in
          totalAssets: tv.totalAssets,
          totalDebt: tv.totalDebt,
          totalRevenue: tv.totalRevenue,
          marketCap: tv.marketCap,
          fetchedAt: new Date().toISOString(),
        });
      }

      // Need SA fallback if missing key screening fields
      if (!hasAssets || !hasDebt) {
        needsSAFallback.push({ stockId, symbol: tv.symbol });
      }
    }

    console.log(
      `[runner] TV: ${financialsBatch.length} with data, ${needsSAFallback.length} need SA fallback`
    );

    // 4. StockAnalysis fallback for missing balance sheet data
    if (saExchange && needsSAFallback.length > 0) {
      console.log(
        `[runner] Running SA fallback for ${needsSAFallback.length} stocks...`
      );
      const breaker = new CircuitBreaker(5);

      for (const { stockId, symbol } of needsSAFallback) {
        if (breaker.isOpen) {
          console.warn(`[runner] SA circuit breaker open — stopping fallback`);
          break;
        }

        try {
          const saData = await scrapeStockAnalysis(symbol, exchange, {
            rateLimitMs: source.rateLimitMs,
            maxRetries: source.maxRetries,
          });

          if (saData) {
            // Find existing entry or create new one
            const existing = financialsBatch.find(
              (f) => f.stockId === stockId
            );
            if (existing) {
              // Merge SA data into existing TV entry
              existing.totalAssets ??= saData.totalAssets;
              existing.totalDebt ??= saData.totalDebt;
              existing.cashAndEquivalents ??= saData.cashAndEquivalents;
              existing.receivables ??= saData.receivables;
              existing.totalRevenue ??= saData.totalRevenue;
            } else {
              financialsBatch.push({
                stockId,
                fiscalYear: saData.fiscalYear,
                fiscalPeriod: "annual",
                source: "stockanalysis",
                totalAssets: saData.totalAssets,
                totalDebt: saData.totalDebt,
                cashAndEquivalents: saData.cashAndEquivalents,
                receivables: saData.receivables,
                totalRevenue: saData.totalRevenue,
                fetchedAt: new Date().toISOString(),
              });
            }
            breaker.recordSuccess();
          } else {
            breaker.recordFailure();
          }
        } catch {
          breaker.recordFailure();
        }

        await rateLimitDelay(source.rateLimitMs);
      }
    }

    // 5. Bulk insert financials
    const BATCH = 50;
    let finCreated = 0;
    let finUpdated = 0;

    for (let i = 0; i < financialsBatch.length; i += BATCH) {
      const batch = financialsBatch.slice(i, i + BATCH);
      const result = await apiPost<{ created: number; updated: number }>(
        "/stock-financials/bulk",
        batch
      );
      finCreated += result.created;
      finUpdated += result.updated;
    }

    console.log(
      `[runner] Financials: ${finCreated} created, ${finUpdated} updated`
    );

    // 6. Run screening
    const stockIds = financialsBatch.map((f) => f.stockId as string);
    if (stockIds.length > 0) {
      console.log(
        `[runner] Running screening for ${stockIds.length} stocks...`
      );
      await apiPost("/stock-compliance/run-screening", { stockIds });
    }

    await apiPut(`/scrape-jobs/${job.id}`, {
      status: "completed",
      completedAt: new Date().toISOString(),
      progress: {
        total: tvStocks.length,
        completed: financialsBatch.length,
        failed: tvStocks.length - financialsBatch.length,
        errors: [],
      },
    });

    console.log(`[runner] Financial update done`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[runner] Financial update failed: ${msg}`);
    await apiPut(`/scrape-jobs/${job.id}`, {
      status: "failed",
      completedAt: new Date().toISOString(),
      errorMessage: msg,
    });
  }
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log(`[runner] Starting scrape runner (API: ${API_URL})`);

  const jobs = await apiGet<ScrapeJob[]>("/scrape-jobs?status=pending");
  console.log(`[runner] Found ${jobs.length} pending jobs`);

  if (jobs.length === 0) {
    console.log("[runner] No pending jobs — exiting");
    return;
  }

  const dataSources = await apiGet<DataSource[]>("/data-sources");
  const sourceById = Object.fromEntries(dataSources.map((s) => [s.id, s]));

  for (const job of jobs) {
    const source = sourceById[job.dataSourceId];
    if (!source) {
      console.error(
        `[runner] Data source ${job.dataSourceId} not found for job ${job.id}`
      );
      await apiPut(`/scrape-jobs/${job.id}`, {
        status: "failed",
        errorMessage: "Data source not found",
      });
      continue;
    }

    console.log(
      `[runner] Processing job ${job.id} (source: ${source.slug}, type: ${job.jobType})`
    );

    if (job.jobType === "price_update") {
      await processPriceUpdateJob(job, source);
    } else if (job.jobType === "financial_update") {
      await processFinancialUpdateJob(job, source);
    } else {
      console.warn(`[runner] Unsupported job type: ${job.jobType}`);
      await apiPut(`/scrape-jobs/${job.id}`, {
        status: "failed",
        errorMessage: `Unsupported job type: ${job.jobType}`,
      });
    }
  }

  console.log("[runner] Done");
}

main().catch((error) => {
  console.error("[runner] Fatal error:", error);
  process.exit(1);
});
