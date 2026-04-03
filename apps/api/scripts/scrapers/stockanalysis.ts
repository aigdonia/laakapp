import { fetchWithRetry, type FetchOptions } from "./fetch-utils";

export interface BalanceSheetData {
  totalAssets: number | null;
  totalDebt: number | null;
  cashAndEquivalents: number | null;
  receivables: number | null;
  marketCap: number | null;
  totalRevenue: number | null;
  fiscalYear: number;
}

/**
 * Scrape balance sheet data from stockanalysis.com.
 *
 * StockAnalysis uses SvelteKit SSR with inline JS data objects.
 * Financial values are in raw units (not millions) — e.g. 1442494120000.
 * We extract named arrays like `assets:[...]`, `debt:[...]`, etc.
 */
export async function scrapeStockAnalysis(
  symbol: string,
  exchange: string,
  options?: FetchOptions
): Promise<BalanceSheetData | null> {
  const exchangeMap: Record<string, string> = {
    EGX: "egx",
    TADAWUL: "tadawul",
    BURSA: "klse",
  };

  const exchangePath = exchangeMap[exchange.toUpperCase()] ?? exchange.toLowerCase();
  const url = `https://stockanalysis.com/quote/${exchangePath}/${symbol.toLowerCase()}/financials/balance-sheet/`;

  const result = await fetchWithRetry<string>(url, options);
  if (!result.ok || !result.data) {
    console.error(`[stockanalysis] Failed to fetch ${symbol}: ${result.error}`);
    return null;
  }

  try {
    const html = result.data;

    // Extract fiscal years
    const fyMatch = html.match(/fiscalYear:\[([^\]]+)\]/);
    if (!fyMatch) {
      console.warn(`[stockanalysis] No fiscalYear data found for ${symbol}`);
      return null;
    }

    const fiscalYears = fyMatch[1]
      .split(",")
      .map((s) => parseInt(s.replace(/"/g, ""), 10));

    // Find the most recent unique year (index 0 may be TTM duplicate)
    // fiscalYear often has duplicates like ["2025","2025","2024",...]
    // First non-duplicate entry is the latest actual filing
    let latestIdx = 0;
    if (fiscalYears.length > 1 && fiscalYears[0] === fiscalYears[1]) {
      latestIdx = 1; // skip TTM duplicate, use the filing
    }

    const extractArray = (key: string): number | null => {
      const match = html.match(new RegExp(`${key}:\\[([^\\]]+)\\]`));
      if (!match) return null;
      const values = match[1].split(",");
      if (latestIdx >= values.length) return null;
      const raw = values[latestIdx].trim();
      if (raw === "null") return null;
      const num = parseFloat(raw);
      return isNaN(num) ? null : num;
    };

    const totalAssets = extractArray("assets");
    const totalDebt = extractArray("debt");
    const cashAndEquivalents = extractArray("cashneq");
    const receivables = extractArray("otherReceivables") ?? extractArray("accruedInterestReceivables");

    if (totalAssets === null) {
      console.warn(`[stockanalysis] No totalAssets data for ${symbol}`);
      return null;
    }

    return {
      totalAssets,
      totalDebt,
      cashAndEquivalents,
      receivables,
      marketCap: null, // not available on balance sheet page
      totalRevenue: null, // available on income statement page, not fetched here
      fiscalYear: fiscalYears[latestIdx] ?? new Date().getFullYear(),
    };
  } catch (error) {
    console.error(
      `[stockanalysis] Parse error for ${symbol}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
