/**
 * TradingView Scanner API scraper.
 *
 * Fetches all stocks for a given exchange in a single API call.
 * Returns prices, market cap, and basic financial data.
 * No authentication required.
 */

export interface TVMarketData {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  close: number | null;
  change: number | null;
  volume: number | null;
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
  "change",
  "volume",
  "market_cap_basic",
  "total_assets_fq",
  "total_debt_fq",
  "total_revenue_ttm",
];

/**
 * Fetch all stocks for an exchange from TradingView's scanner API.
 *
 * @param exchange - Exchange code (e.g. "EGX", "TADAWUL", "BURSA") or "US" for US large-caps
 * @param tvRegion - TradingView region slug (e.g. "egypt", "global", "america")
 * @param minMarketCap - Optional minimum market cap filter (e.g. 10_000_000_000 for US)
 */
export async function scrapeTradingViewMarket(
  exchange: string,
  tvRegion: string,
  minMarketCap?: number
): Promise<TVMarketData[]> {
  const url = `https://scanner.tradingview.com/${tvRegion}/scan`;

  const filter: Array<Record<string, unknown>> = [
    { left: "type", operation: "equal", right: "stock" },
  ];

  // US uses market cap filter + is_primary instead of exchange filter
  if (minMarketCap) {
    filter.push({ left: "is_primary", operation: "equal", right: true });
    filter.push({ left: "market_cap_basic", operation: "greater", right: minMarketCap });
  } else {
    filter.push({ left: "exchange", operation: "equal", right: exchange });
  }

  console.log(`[tv] Fetching ${exchange} from ${url}${minMarketCap ? ` (cap > $${(minMarketCap / 1e9).toFixed(0)}B)` : ""}...`);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      columns: TV_COLUMNS,
      filter,
      options: { lang: "en" },
      range: [0, 1000],
      sort: { sortBy: "name", sortOrder: "asc" },
    }),
  });

  if (!res.ok) {
    throw new Error(`TradingView scanner failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as {
    totalCount: number;
    data: Array<{ s: string; d: unknown[] }>;
  };

  console.log(`[tv] ${exchange}: ${json.totalCount} stocks`);

  return json.data.map((item) => ({
    symbol: item.d[0] as string,
    name: item.d[1] as string,
    sector: (item.d[2] as string) ?? "",
    industry: (item.d[3] as string) ?? "",
    close: item.d[4] as number | null,
    change: item.d[5] as number | null,
    volume: item.d[6] as number | null,
    marketCap: item.d[7] as number | null,
    totalAssets: item.d[8] as number | null,
    totalDebt: item.d[9] as number | null,
    totalRevenue: item.d[10] as number | null,
  }));
}
