/**
 * One-time migration: import US large-cap stocks ($10B+ market cap) from TradingView.
 *
 * Usage:
 *   npx tsx scripts/migrate-us-tradingview.ts \
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
  exchange: string;
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
  "exchange",
  "sector",
  "industry",
  "close",
  "market_cap_basic",
  "total_assets_fq",
  "total_debt_fq",
  "total_revenue_ttm",
];

async function fetchTradingViewUS(): Promise<TVStock[]> {
  console.log("[tv] Fetching US large-cap stocks ($10B+) from TradingView...");

  const res = await fetch("https://scanner.tradingview.com/america/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      columns: TV_COLUMNS,
      filter: [
        { left: "is_primary", operation: "equal", right: true },
        { left: "type", operation: "equal", right: "stock" },
        { left: "market_cap_basic", operation: "greater", right: 10_000_000_000 },
      ],
      options: { lang: "en" },
      range: [0, 1000],
      sort: { sortBy: "market_cap_basic", sortOrder: "desc" },
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
    exchange: item.d[2] as string,
    sector: (item.d[3] as string) ?? "",
    industry: (item.d[4] as string) ?? "",
    close: item.d[5] as number | null,
    marketCap: item.d[6] as number | null,
    totalAssets: item.d[7] as number | null,
    totalDebt: item.d[8] as number | null,
    totalRevenue: item.d[9] as number | null,
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

  // 1. Fetch existing US stocks from DB
  console.log("[migrate] Step 1: Fetching existing US stocks...");
  const existing = await apiGet<{
    data: Array<{ id: string; symbol: string }>;
  }>("/stocks?countries=US&limit=2000");
  console.log(`[migrate] Found ${existing.data.length} existing US stocks`);

  // 2. Delete dependent data
  if (existing.data.length > 0) {
    console.log("[migrate] Step 2: Cleaning up dependent data...");

    const stockIds = new Set(existing.data.map((s) => s.id));

    const compliance = await apiGet<
      Array<{ id: string; stockId: string }>
    >("/stock-compliance?limit=10000");
    const usCompliance = compliance.filter((c) => stockIds.has(c.stockId));
    for (const record of usCompliance) {
      await apiDelete(`/stock-compliance/${record.id}`);
    }
    console.log(`[migrate]   Deleted ${usCompliance.length} compliance records`);

    const financials = await apiGet<
      Array<{ id: string; stockId: string }>
    >("/stock-financials?limit=10000");
    const usFinancials = financials.filter((f) => stockIds.has(f.stockId));
    for (const record of usFinancials) {
      await apiDelete(`/stock-financials/${record.id}`);
    }
    console.log(`[migrate]   Deleted ${usFinancials.length} financial records`);

    console.log("[migrate] Step 3: Deleting existing US stocks...");
    for (const stock of existing.data) {
      await apiDelete(`/stocks/${stock.id}`);
    }
    console.log(`[migrate]   Deleted ${existing.data.length} stocks`);
  }

  // 3. Fetch from TradingView
  console.log("[migrate] Step 4: Fetching TradingView data...");
  const tvStocks = await fetchTradingViewUS();

  // 4. Insert stocks — map exchange from TradingView (NASDAQ, NYSE, AMEX)
  console.log("[migrate] Step 5: Inserting stocks...");
  const BATCH = 50;
  let totalCreated = 0;
  let totalUpdated = 0;

  for (let i = 0; i < tvStocks.length; i += BATCH) {
    const batch = tvStocks.slice(i, i + BATCH).map((s) => ({
      symbol: s.symbol,
      name: s.name,
      countryCode: "US",
      exchange: s.exchange,
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

  // 5. Insert financials
  console.log("[migrate] Step 6: Inserting financials...");

  const newStocks = await apiGet<{
    data: Array<{ id: string; symbol: string }>;
  }>("/stocks?countries=US&limit=2000");
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
  const exchanges = new Map<string, number>();
  for (const s of tvStocks) {
    exchanges.set(s.exchange, (exchanges.get(s.exchange) ?? 0) + 1);
  }

  console.log();
  console.log("=== Migration Complete ===");
  console.log(`  Stocks: ${totalCreated} created`);
  console.log(`  Financials: ${finCreated} created`);
  for (const [ex, count] of exchanges) {
    console.log(`  ${ex}: ${count} stocks`);
  }
  console.log(`  Source: TradingView Scanner API ($10B+ market cap)`);
}

main().catch((err) => {
  console.error("[migrate] Fatal:", err);
  process.exit(1);
});
