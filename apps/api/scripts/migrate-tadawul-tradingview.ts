/**
 * One-time migration: replace all TADAWUL stocks with TradingView data.
 *
 * Usage:
 *   npx tsx scripts/migrate-tadawul-tradingview.ts \
 *     --api-url https://laak-api.ahmedgaber-1988-masterai.workers.dev \
 *     --admin-key <key>
 */

const API_URL = process.argv.includes("--api-url")
  ? process.argv[process.argv.indexOf("--api-url") + 1]
  : "http://localhost:12003";

const ADMIN_KEY = process.argv.includes("--admin-key")
  ? process.argv[process.argv.indexOf("--admin-key") + 1]
  : process.env.ADMIN_API_KEY ?? "";

const authHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  ...(ADMIN_KEY ? { Authorization: `Bearer ${ADMIN_KEY}` } : {}),
};

// ─── TradingView Scanner ─────────────────────────────────────

interface TVStock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  close: number | null;
  marketCap: number | null;
  totalAssets: number | null;
  totalDebt: number | null;
  totalRevenue: number | null;
}

const TV_COLUMNS = [
  "name",
  "description",
  "sector",
  "industry",
  "close",
  "market_cap_basic",
  "total_assets_fq",
  "total_debt_fq",
  "total_revenue_ttm",
];

async function fetchTradingViewTADAWUL(): Promise<TVStock[]> {
  console.log("[tv] Fetching TADAWUL stocks from TradingView scanner...");

  const res = await fetch("https://scanner.tradingview.com/global/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      columns: TV_COLUMNS,
      filter: [
        { left: "exchange", operation: "equal", right: "TADAWUL" },
        { left: "type", operation: "equal", right: "stock" },
      ],
      options: { lang: "en" },
      range: [0, 500],
      sort: { sortBy: "name", sortOrder: "asc" },
    }),
  });

  if (!res.ok) throw new Error(`TradingView API failed: ${res.status}`);

  const json = (await res.json()) as {
    totalCount: number;
    data: Array<{ s: string; d: unknown[] }>;
  };

  console.log(`[tv] Got ${json.totalCount} stocks`);

  return json.data.map((item) => ({
    symbol: item.d[0] as string,
    name: item.d[1] as string,
    sector: (item.d[2] as string) ?? "",
    industry: (item.d[3] as string) ?? "",
    close: item.d[4] as number | null,
    marketCap: item.d[5] as number | null,
    totalAssets: item.d[6] as number | null,
    totalDebt: item.d[7] as number | null,
    totalRevenue: item.d[8] as number | null,
  }));
}

// ─── API Helpers ─────────────────────────────────────────────

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} failed: ${res.status} — ${text}`);
  }
  return res.json() as Promise<T>;
}

async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DELETE ${path} failed: ${res.status} — ${text}`);
  }
}

// ─── Migration ───────────────────────────────────────────────

async function main() {
  console.log(`[migrate] API: ${API_URL}`);
  console.log();

  // 1. Fetch existing TADAWUL stocks from DB
  console.log("[migrate] Step 1: Fetching existing TADAWUL stocks...");
  const existing = await apiGet<{
    data: Array<{ id: string; symbol: string }>;
  }>("/stocks?countries=SA&limit=500");
  console.log(`[migrate] Found ${existing.data.length} existing TADAWUL stocks`);

  // 2. Delete dependent data for each existing stock
  if (existing.data.length > 0) {
    console.log("[migrate] Step 2: Cleaning up dependent data...");

    // Get all stock IDs
    const stockIds = new Set(existing.data.map((s) => s.id));

    // Delete compliance records (API returns plain array)
    const compliance = await apiGet<
      Array<{ id: string; stockId: string }>
    >("/stock-compliance?limit=5000");
    const tadawulCompliance = compliance.filter((c) => stockIds.has(c.stockId));
    for (const record of tadawulCompliance) {
      await apiDelete(`/stock-compliance/${record.id}`);
    }
    console.log(`[migrate]   Deleted ${tadawulCompliance.length} compliance records`);

    // Delete financials (API returns plain array)
    const financials = await apiGet<
      Array<{ id: string; stockId: string }>
    >("/stock-financials?limit=5000");
    const tadawulFinancials = financials.filter((f) => stockIds.has(f.stockId));
    for (const record of tadawulFinancials) {
      await apiDelete(`/stock-financials/${record.id}`);
    }
    console.log(`[migrate]   Deleted ${tadawulFinancials.length} financial records`);

    // Delete stocks
    console.log("[migrate] Step 3: Deleting existing TADAWUL stocks...");
    for (const stock of existing.data) {
      await apiDelete(`/stocks/${stock.id}`);
    }
    console.log(`[migrate]   Deleted ${existing.data.length} stocks`);
  }

  // 3. Fetch from TradingView
  console.log("[migrate] Step 4: Fetching TradingView data...");
  const tvStocks = await fetchTradingViewTADAWUL();

  // 4. Insert stocks via bulk endpoint
  console.log("[migrate] Step 5: Inserting stocks...");
  const BATCH = 50;
  let totalCreated = 0;
  let totalUpdated = 0;

  for (let i = 0; i < tvStocks.length; i += BATCH) {
    const batch = tvStocks.slice(i, i + BATCH).map((s) => ({
      symbol: s.symbol,
      name: s.name,
      countryCode: "SA",
      exchange: "TADAWUL",
      sector: s.sector,
      lastPrice: s.close,
    }));

    const result = await apiPost<{
      created: number;
      updated: number;
      errors: string[];
    }>("/stocks/bulk", batch);
    totalCreated += result.created;
    totalUpdated += result.updated;

    if (result.errors.length > 0) {
      console.warn(`[migrate]   Errors:`, result.errors);
    }
  }
  console.log(
    `[migrate]   Stocks: ${totalCreated} created, ${totalUpdated} updated`
  );

  // 5. Insert financials for stocks that have data
  console.log("[migrate] Step 6: Inserting financials...");

  // Fetch the newly created stocks to get their IDs
  const newStocks = await apiGet<{
    data: Array<{ id: string; symbol: string }>;
  }>("/stocks?countries=SA&limit=500");
  const symbolToId = new Map(newStocks.data.map((s) => [s.symbol, s.id]));

  const year = new Date().getFullYear();
  const financialItems: Array<Record<string, unknown>> = [];

  for (const s of tvStocks) {
    const stockId = symbolToId.get(s.symbol);
    if (!stockId) continue;
    if (!s.totalAssets && !s.totalDebt && !s.totalRevenue && !s.marketCap)
      continue;

    financialItems.push({
      stockId,
      fiscalYear: year,
      fiscalPeriod: "annual",
      source: "manual",
      totalAssets: s.totalAssets,
      totalDebt: s.totalDebt,
      totalRevenue: s.totalRevenue,
      marketCap: s.marketCap,
      fetchedAt: new Date().toISOString(),
    });
  }

  let finCreated = 0;
  let finUpdated = 0;
  for (let i = 0; i < financialItems.length; i += BATCH) {
    const batch = financialItems.slice(i, i + BATCH);
    const result = await apiPost<{ created: number; updated: number }>(
      "/stock-financials/bulk",
      batch
    );
    finCreated += result.created;
    finUpdated += result.updated;
  }
  console.log(
    `[migrate]   Financials: ${finCreated} created, ${finUpdated} updated (${financialItems.length} with data)`
  );

  // Summary
  console.log();
  console.log("=== Migration Complete ===");
  console.log(`  Stocks: ${totalCreated} created`);
  console.log(`  Financials: ${finCreated} created`);
  console.log(`  Source: TradingView Scanner API`);
}

main().catch((err) => {
  console.error("[migrate] Fatal:", err);
  process.exit(1);
});
