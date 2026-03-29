/**
 * Scrape Runner — standalone Node.js script for processing scrape jobs.
 *
 * Usage: npx tsx scripts/scrape-runner.ts [--api-url http://localhost:12003]
 *
 * 1. Polls GET /scrape-jobs?status=pending
 * 2. For each job: fetch data → POST to bulk endpoints → update progress
 * 3. After financials saved: run screening → POST compliance results
 */

import { CircuitBreaker, rateLimitDelay } from "./scrapers/fetch-utils";
import { scrapeStockAnalysis } from "./scrapers/stockanalysis";
import { scrapeMubasher } from "./scrapers/mubasher";
import { fetchEgxShariahIndex } from "./scrapers/index-list-egx";

const API_URL = process.argv.includes("--api-url")
  ? process.argv[process.argv.indexOf("--api-url") + 1]
  : "http://localhost:12003";

interface ScrapeJob {
  id: string;
  dataSourceId: string;
  status: string;
  jobType: string;
  targetSymbols: string[] | null;
  progress: { total: number; completed: number; failed: number; errors: string[] };
}

interface DataSource {
  id: string;
  slug: string;
  type: string;
  rateLimitMs: number;
  maxRetries: number;
  countryCodes: string[];
}

interface Stock {
  id: string;
  symbol: string;
  exchange: string;
  countryCode: string;
  sector: string;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function apiPut(path: string, body: unknown): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} → ${res.status}`);
}

async function processScraperJob(
  job: ScrapeJob,
  source: DataSource,
  allStocks: Stock[]
) {
  // Filter stocks by target symbols or data source country codes
  let targetStocks = allStocks.filter((s) =>
    source.countryCodes.includes(s.countryCode)
  );

  if (job.targetSymbols && job.targetSymbols.length > 0) {
    const targetSet = new Set(job.targetSymbols.map((s) => s.toUpperCase()));
    targetStocks = targetStocks.filter((s) => targetSet.has(s.symbol));
  }

  const progress = {
    total: targetStocks.length,
    completed: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Update job to running
  await apiPut(`/scrape-jobs/${job.id}`, {
    status: "running",
    startedAt: new Date().toISOString(),
    progress,
  });

  const breaker = new CircuitBreaker(5);
  const financialsBatch: Array<Record<string, unknown>> = [];

  for (const stock of targetStocks) {
    if (breaker.isOpen) {
      const msg = `Circuit breaker open after 5 consecutive failures — aborting`;
      console.error(`[runner] ${msg}`);
      progress.errors.push(msg);
      break;
    }

    try {
      let financials: Record<string, unknown> | null = null;

      if (source.slug === "stockanalysis") {
        const data = await scrapeStockAnalysis(stock.symbol, stock.exchange, {
          rateLimitMs: source.rateLimitMs,
          maxRetries: source.maxRetries,
        });
        if (data) {
          financials = {
            stockId: stock.id,
            fiscalYear: data.fiscalYear,
            fiscalPeriod: "annual",
            source: "stockanalysis",
            totalAssets: data.totalAssets,
            totalDebt: data.totalDebt,
            cashAndEquivalents: data.cashAndEquivalents,
            receivables: data.receivables,
            marketCap: data.marketCap,
            totalRevenue: data.totalRevenue,
            fetchedAt: new Date().toISOString(),
          };
        }
      } else if (source.slug === "mubasher") {
        const data = await scrapeMubasher(stock.symbol, {
          rateLimitMs: source.rateLimitMs,
          maxRetries: source.maxRetries,
        });
        if (data) {
          financials = {
            stockId: stock.id,
            fiscalYear: data.fiscalYear,
            fiscalPeriod: "annual",
            source: "mubasher",
            totalAssets: data.totalAssets,
            totalDebt: data.totalDebt,
            cashAndEquivalents: data.cashAndEquivalents,
            interestBearingDeposits: data.interestBearingDeposits,
            receivables: data.receivables,
            totalRevenue: data.totalRevenue,
            fetchedAt: new Date().toISOString(),
          };
        }
      }

      if (financials) {
        financialsBatch.push(financials);
        breaker.recordSuccess();
      } else {
        breaker.recordFailure();
        progress.failed++;
        progress.errors.push(`No data for ${stock.symbol}`);
      }

      progress.completed++;

      // Update progress every 10 stocks
      if (progress.completed % 10 === 0) {
        await apiPut(`/scrape-jobs/${job.id}`, { progress });
      }
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : String(error);
      console.error(`[runner] Error scraping ${stock.symbol}: ${msg}`);
      progress.failed++;
      progress.errors.push(`${stock.symbol}: ${msg}`);

      if (breaker.recordFailure()) {
        progress.errors.push("Circuit breaker tripped");
        break;
      }
    }

    await rateLimitDelay(source.rateLimitMs);
  }

  // Bulk insert financials
  if (financialsBatch.length > 0) {
    console.log(
      `[runner] Inserting ${financialsBatch.length} financials records...`
    );
    await apiPost("/stock-financials/bulk", financialsBatch);
  }

  // Run screening for stocks that got new financials
  const stockIds = financialsBatch.map((f) => f.stockId as string);
  if (stockIds.length > 0) {
    console.log(`[runner] Running screening for ${stockIds.length} stocks...`);
    await apiPost("/stock-compliance/run-screening", { stockIds });
  }

  // Mark job completed
  await apiPut(`/scrape-jobs/${job.id}`, {
    status: breaker.isOpen ? "failed" : "completed",
    completedAt: new Date().toISOString(),
    progress,
    errorMessage: breaker.isOpen
      ? "Aborted: too many consecutive failures"
      : null,
  });
}

async function processIndexListJob(
  job: ScrapeJob,
  source: DataSource
) {
  await apiPut(`/scrape-jobs/${job.id}`, {
    status: "running",
    startedAt: new Date().toISOString(),
  });

  try {
    let symbols: string[] = [];

    if (source.slug === "egx33-shariah") {
      symbols = await fetchEgxShariahIndex({
        rateLimitMs: source.rateLimitMs,
      });
    }
    // sc-malaysia and icap-saudi are placeholders for now

    console.log(
      `[runner] Index list ${source.slug}: found ${symbols.length} symbols`
    );

    await apiPut(`/scrape-jobs/${job.id}`, {
      status: "completed",
      completedAt: new Date().toISOString(),
      progress: {
        total: symbols.length,
        completed: symbols.length,
        failed: 0,
        errors: [],
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await apiPut(`/scrape-jobs/${job.id}`, {
      status: "failed",
      completedAt: new Date().toISOString(),
      errorMessage: msg,
    });
  }
}

async function main() {
  console.log(`[runner] Starting scrape runner (API: ${API_URL})`);

  // Get pending jobs
  const jobs = await apiGet<ScrapeJob[]>("/scrape-jobs?status=pending");
  console.log(`[runner] Found ${jobs.length} pending jobs`);

  if (jobs.length === 0) {
    console.log("[runner] No pending jobs — exiting");
    return;
  }

  // Get all stocks and data sources
  const allStocks = await apiGet<Stock[]>("/stocks");
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

    if (source.type === "scraper") {
      await processScraperJob(job, source, allStocks);
    } else if (source.type === "index_list") {
      await processIndexListJob(job, source);
    } else {
      console.warn(`[runner] Unsupported source type: ${source.type}`);
      await apiPut(`/scrape-jobs/${job.id}`, {
        status: "failed",
        errorMessage: `Unsupported source type: ${source.type}`,
      });
    }
  }

  console.log("[runner] Done");
}

main().catch((error) => {
  console.error("[runner] Fatal error:", error);
  process.exit(1);
});
