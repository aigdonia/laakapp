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
 * Returns parsed financial data for a given stock symbol.
 *
 * Note: stockanalysis.com serves data via JS hydration.
 * This scraper looks for __NEXT_DATA__ JSON in page source.
 */
export async function scrapeStockAnalysis(
  symbol: string,
  exchange: string,
  options?: FetchOptions
): Promise<BalanceSheetData | null> {
  // Map exchange codes to stockanalysis paths
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

    // Look for __NEXT_DATA__ script tag
    const nextDataMatch = html.match(
      /<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s
    );

    if (!nextDataMatch?.[1]) {
      console.warn(`[stockanalysis] No __NEXT_DATA__ found for ${symbol}`);
      return null;
    }

    const nextData = JSON.parse(nextDataMatch[1]);
    const financials = nextData?.props?.pageProps?.data;

    if (!financials) {
      console.warn(`[stockanalysis] No financial data in page props for ${symbol}`);
      return null;
    }

    // Extract the most recent annual data
    const annual = financials.annual ?? financials;
    const years = annual.fiscalYear ?? [];
    const latestIdx = 0; // First entry = most recent

    return {
      totalAssets: parseNumber(annual.totalAssets?.[latestIdx]),
      totalDebt: parseNumber(annual.totalDebt?.[latestIdx]),
      cashAndEquivalents: parseNumber(annual.cashAndShortTermInvestments?.[latestIdx]),
      receivables: parseNumber(annual.receivables?.[latestIdx]),
      marketCap: parseNumber(annual.marketCap?.[latestIdx]),
      totalRevenue: parseNumber(annual.revenue?.[latestIdx]),
      fiscalYear: years[latestIdx] ?? new Date().getFullYear(),
    };
  } catch (error) {
    console.error(
      `[stockanalysis] Parse error for ${symbol}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

function parseNumber(value: unknown): number | null {
  if (value == null) return null;
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  return isNaN(num) ? null : num;
}
