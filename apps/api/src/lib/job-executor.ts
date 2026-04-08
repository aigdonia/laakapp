/**
 * Job Executor — runs a scrape job inside the CF Worker.
 *
 * Reads the data source config, resolves URL template + params,
 * dispatches to the matching script, writes logs to R2, updates D1.
 */

import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { dataSources, scrapeJobs, scrapeExecutions } from "../db/schema";
import { JobLogger } from "./job-logger";

// ─── Script Registry ─────────────────────────────────────────
// Each script is a function that receives resolved params and a logger,
// and returns a result with counts.

interface ScriptResult {
  total: number;
  completed: number;
  failed: number;
}

type ScriptFn = (
  params: Record<string, string | number | null>,
  url: string,
  logger: JobLogger,
  db: Database
) => Promise<ScriptResult>;

// ─── TradingView Prices Script ───────────────────────────────

const tradingviewPrices: ScriptFn = async (params, url, logger, db) => {
  const exchange = params.exchange as string;
  const minMarketCap = params.minMarketCap as number | null;

  logger.info(`Fetching prices for ${exchange} from ${url}`);

  const filter: Array<Record<string, unknown>> = [
    { left: "type", operation: "equal", right: "stock" },
  ];

  if (minMarketCap) {
    filter.push({ left: "is_primary", operation: "equal", right: true });
    filter.push({
      left: "market_cap_basic",
      operation: "greater",
      right: minMarketCap,
    });
  } else {
    filter.push({ left: "exchange", operation: "equal", right: exchange });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      columns: ["name", "close", "market_cap_basic"],
      filter,
      options: { lang: "en" },
      range: [0, 1000],
      sort: { sortBy: "name", sortOrder: "asc" },
    }),
  });

  if (!res.ok) {
    throw new Error(`TradingView API failed: ${res.status}`);
  }

  const json = (await res.json()) as {
    totalCount: number;
    data: Array<{ s: string; d: unknown[] }>;
  };

  logger.info(`Got ${json.totalCount} stocks from TradingView`);

  // Batch update prices via DB directly
  const now = new Date().toISOString();
  let updated = 0;

  const { stocks } = await import("../db/schema");

  for (const item of json.data) {
    const symbol = item.d[0] as string;
    const close = item.d[1] as number | null;

    if (!symbol || close == null) continue;

    const result = await db
      .update(stocks)
      .set({
        lastPrice: close,
        lastPriceUpdatedAt: now,
        updatedAt: now,
      })
      .where(eq(stocks.symbol, symbol.toUpperCase()))
      .returning({ id: stocks.id })
      .get();

    if (result) updated++;
  }

  logger.info(`Updated ${updated}/${json.totalCount} stock prices`);

  return {
    total: json.totalCount,
    completed: updated,
    failed: json.totalCount - updated,
  };
};

// ─── TradingView Financials Script ───────────────────────────

const tradingviewFinancials: ScriptFn = async (params, url, logger, db) => {
  const exchange = params.exchange as string;
  const minMarketCap = params.minMarketCap as number | null;

  logger.info(`Fetching financials for ${exchange} from ${url}`);

  const filter: Array<Record<string, unknown>> = [
    { left: "type", operation: "equal", right: "stock" },
  ];

  if (minMarketCap) {
    filter.push({ left: "is_primary", operation: "equal", right: true });
    filter.push({
      left: "market_cap_basic",
      operation: "greater",
      right: minMarketCap,
    });
  } else {
    filter.push({ left: "exchange", operation: "equal", right: exchange });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      columns: [
        "name",
        "market_cap_basic",
        "total_assets_fq",
        "total_debt_fq",
        "total_revenue_ttm",
      ],
      filter,
      options: { lang: "en" },
      range: [0, 1000],
      sort: { sortBy: "name", sortOrder: "asc" },
    }),
  });

  if (!res.ok) {
    throw new Error(`TradingView API failed: ${res.status}`);
  }

  const json = (await res.json()) as {
    totalCount: number;
    data: Array<{ s: string; d: unknown[] }>;
  };

  logger.info(`Got ${json.totalCount} stocks from TradingView`);

  const { stocks } = await import("../db/schema");
  const now = new Date().toISOString();
  const year = new Date().getFullYear();

  // Build symbol → stockId map
  const allStocks = await db.select({ id: stocks.id, symbol: stocks.symbol }).from(stocks).all();
  const symbolToId = new Map(allStocks.map((s) => [s.symbol, s.id]));

  // Build batch of financials
  const batch: Array<Record<string, unknown>> = [];
  for (const item of json.data) {
    const symbol = item.d[0] as string;
    const marketCap = item.d[1] as number | null;
    const totalAssets = item.d[2] as number | null;
    const totalDebt = item.d[3] as number | null;
    const totalRevenue = item.d[4] as number | null;

    if (!symbol) continue;
    const stockId = symbolToId.get(symbol.toUpperCase());
    if (!stockId) continue;
    if (!marketCap && !totalAssets && !totalDebt && !totalRevenue) continue;

    batch.push({
      stockId,
      fiscalYear: year,
      fiscalPeriod: "annual",
      source: "stockanalysis",
      marketCap,
      totalAssets,
      totalDebt,
      totalRevenue,
      fetchedAt: now,
    });
  }

  logger.info(`Upserting ${batch.length} financials...`);

  // Single INSERT ON CONFLICT per stock — no SELECT needed
  // Relies on unique index: (stock_id, fiscal_year, fiscal_period, source)
  const { sql } = await import("drizzle-orm");
  let updated = 0;

  for (const item of batch) {
    await db.run(sql`
      INSERT INTO stock_financials (id, stock_id, fiscal_year, fiscal_period, source, market_cap, total_assets, total_debt, total_revenue, fetched_at, updated_at)
      VALUES (lower(hex(randomblob(16))), ${item.stockId}, ${item.fiscalYear}, ${item.fiscalPeriod}, ${item.source}, ${item.marketCap}, ${item.totalAssets}, ${item.totalDebt}, ${item.totalRevenue}, ${item.fetchedAt}, ${now})
      ON CONFLICT (stock_id, fiscal_year, fiscal_period, source) DO UPDATE SET
        market_cap = excluded.market_cap,
        total_assets = excluded.total_assets,
        total_debt = excluded.total_debt,
        total_revenue = excluded.total_revenue,
        fetched_at = excluded.fetched_at,
        updated_at = excluded.updated_at
    `);
    updated++;
  }

  logger.info(`Updated financials for ${updated}/${json.totalCount} stocks`);

  return {
    total: json.totalCount,
    completed: updated,
    failed: json.totalCount - updated,
  };
};

// ─── Script Dispatch Map ─────────────────────────────────────

const SCRIPTS: Record<string, ScriptFn> = {
  "tradingview-prices": tradingviewPrices,
  "tradingview-financials": tradingviewFinancials,
};

// ─── URL Template Resolution ─────────────────────────────────

function resolveUrl(
  template: string,
  params: Record<string, string | number | null>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = params[key];
    return value != null ? String(value) : "";
  });
}

// ─── Main Executor ───────────────────────────────────────────

/**
 * Execute a scrape job by creating a new execution record and running the script.
 * The job itself is never modified — only the execution record tracks status.
 */
export async function executeJob(
  job: { id: string; dataSourceId: string; params: Record<string, string | number | null> },
  trigger: "manual" | "cron" | "retry",
  db: Database,
  bucket: R2Bucket
) {
  const logger = new JobLogger();

  // Create execution record
  const execution = await db
    .insert(scrapeExecutions)
    .values({ jobId: job.id, trigger })
    .returning()
    .get();

  const logKey = `logs/executions/${execution.id}.jsonl`;

  // Load data source
  const source = await db
    .select()
    .from(dataSources)
    .where(eq(dataSources.id, job.dataSourceId))
    .get();

  if (!source) {
    const msg = "Data source not found";
    logger.error(msg);
    await logger.flush(bucket, logKey);
    await db
      .update(scrapeExecutions)
      .set({ status: "failed", errorMessage: msg, logKey, updatedAt: new Date().toISOString() })
      .where(eq(scrapeExecutions.id, execution.id));
    return execution;
  }

  // Find script
  const script = SCRIPTS[source.slug];
  if (!script) {
    const msg = `No script registered for slug: ${source.slug}`;
    logger.error(msg);
    await logger.flush(bucket, logKey);
    await db
      .update(scrapeExecutions)
      .set({ status: "failed", errorMessage: msg, logKey, updatedAt: new Date().toISOString() })
      .where(eq(scrapeExecutions.id, execution.id));
    return execution;
  }

  // Resolve URL
  const url = resolveUrl(source.urlTemplate, job.params);

  logger.info(`Execution ${execution.id} for job ${job.id}`);
  logger.info(`Data source: ${source.slug}`);
  logger.info(`URL: ${url}`);
  logger.info(`Params: ${JSON.stringify(job.params)}`);

  // Mark as running
  const now = new Date().toISOString();
  await db
    .update(scrapeExecutions)
    .set({ status: "running", startedAt: now, logKey, updatedAt: now })
    .where(eq(scrapeExecutions.id, execution.id));

  try {
    const result = await script(job.params, url, logger, db);

    const completedAt = new Date().toISOString();
    await db
      .update(scrapeExecutions)
      .set({
        status: "completed",
        completedAt,
        progress: {
          total: result.total,
          completed: result.completed,
          failed: result.failed,
          errors: [],
        },
        updatedAt: completedAt,
      })
      .where(eq(scrapeExecutions.id, execution.id));

    logger.info(
      `Completed: ${result.completed}/${result.total} (${result.failed} failed)`
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Failed: ${msg}`);

    const failedAt = new Date().toISOString();
    await db
      .update(scrapeExecutions)
      .set({
        status: "failed",
        completedAt: failedAt,
        errorMessage: msg,
        updatedAt: failedAt,
      })
      .where(eq(scrapeExecutions.id, execution.id));
  }

  // Always flush logs
  await logger.flush(bucket, logKey);

  // Return the updated execution
  return db
    .select()
    .from(scrapeExecutions)
    .where(eq(scrapeExecutions.id, execution.id))
    .get();
}
