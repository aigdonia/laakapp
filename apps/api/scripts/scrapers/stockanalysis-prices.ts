import { fetchWithRetry, rateLimitDelay, type FetchOptions } from "./fetch-utils";

export interface StockPriceEntry {
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  marketCap: number | null;
  revenue: number | null;
}

/**
 * Exchange-to-URL mapping for StockAnalysis listing pages.
 * Key = exchange code used in our stocks DB.
 * Value = { slug for URL, prefix to strip from symbol field }.
 */
const EXCHANGE_CONFIG: Record<string, { slug: string; prefix: string }> = {
  EGX: { slug: "egyptian-stock-exchange", prefix: "egx/" },
  TADAWUL: { slug: "saudi-stock-exchange", prefix: "tadawul/" },
  NASDAQ: { slug: "nasdaq-stocks", prefix: "" },
  NYSE: { slug: "nyse-stocks", prefix: "" },
  BURSA: { slug: "bursa-malaysia", prefix: "klse/" },
};

/**
 * Scrape all stock prices from a StockAnalysis exchange listing page.
 * Single HTTP request per page (500 stocks max). Auto-paginates if needed.
 */
export async function scrapeExchangePrices(
  exchange: string,
  options?: FetchOptions
): Promise<StockPriceEntry[]> {
  const config = EXCHANGE_CONFIG[exchange.toUpperCase()];
  if (!config) {
    console.error(`[prices] Unknown exchange: ${exchange}. Known: ${Object.keys(EXCHANGE_CONFIG).join(", ")}`);
    return [];
  }

  const allStocks: StockPriceEntry[] = [];
  let page = 1;

  while (true) {
    const url = `https://stockanalysis.com/list/${config.slug}/${page > 1 ? `?page=${page}` : ""}`;
    console.log(`[prices] Fetching ${exchange} page ${page}: ${url}`);

    const result = await fetchWithRetry<string>(url, options);
    if (!result.ok || !result.data) {
      console.error(`[prices] Failed to fetch ${exchange} page ${page}: ${result.error}`);
      break;
    }

    const stocks = parseStockData(result.data, config.prefix);
    if (stocks.length === 0) break;

    allStocks.push(...stocks);
    console.log(`[prices] ${exchange} page ${page}: ${stocks.length} stocks (total: ${allStocks.length})`);

    // StockAnalysis serves 500 per page. If we got fewer, we're done.
    if (stocks.length < 500) break;

    page++;
    await rateLimitDelay(options?.rateLimitMs ?? 2000);
  }

  return allStocks;
}

/**
 * Parse the inline `stockData:[...]` array from the HTML.
 * Uses regex to extract JS object notation, then converts to JSON.
 */
function parseStockData(html: string, symbolPrefix: string): StockPriceEntry[] {
  // Match the stockData array — greedy match up to the closing bracket
  const match = html.match(/stockData:\[(\{.*?\})\]/s);
  if (!match) {
    console.warn("[prices] No stockData found in page");
    return [];
  }

  try {
    // The data is JS object notation (unquoted keys, JS-style numbers).
    // 1. Quote unquoted keys: {no:1 → {"no":1
    // 2. Fix JS numbers: -.633 → -0.633, .15 → 0.15
    const jsArray = `[${match[1]}]`;
    const json = jsArray
      .replace(/([{,])(\w+):/g, '$1"$2":')
      .replace(/:(-?)\./g, ':$10.');
    const data: Array<{
      s?: string;
      n?: string;
      price?: number;
      change?: number;
      marketCap?: number;
      revenue?: number;
    }> = JSON.parse(json);

    return data
      .filter((d) => d.s && d.price != null)
      .map((d) => {
        // Strip exchange prefix from symbol: "egx/COMI" → "COMI"
        let symbol = d.s!;
        if (symbolPrefix && symbol.toLowerCase().startsWith(symbolPrefix.toLowerCase())) {
          symbol = symbol.slice(symbolPrefix.length);
        }
        return {
          symbol: symbol.toUpperCase(),
          name: d.n ?? "",
          price: d.price ?? null,
          change: d.change ?? null,
          marketCap: d.marketCap ?? null,
          revenue: d.revenue ?? null,
        };
      });
  } catch (error) {
    console.error("[prices] Failed to parse stockData:", error instanceof Error ? error.message : error);
    return [];
  }
}

export const SUPPORTED_EXCHANGES = Object.keys(EXCHANGE_CONFIG);
