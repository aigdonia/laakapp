import { fetchWithRetry, type FetchOptions } from "./fetch-utils";

export interface MubasherFinancials {
  totalAssets: number | null;
  totalDebt: number | null;
  cashAndEquivalents: number | null;
  interestBearingDeposits: number | null;
  receivables: number | null;
  totalRevenue: number | null;
  fiscalYear: number;
}

/**
 * Fetch financial statement data from Mubasher's API.
 * Mubasher provides JSON API endpoints for financial data.
 */
export async function scrapeMubasher(
  symbol: string,
  options?: FetchOptions
): Promise<MubasherFinancials | null> {
  const url = `https://www.mubasher.info/api/1/listed-entity/financial-statement/${symbol}?lang=en`;

  const result = await fetchWithRetry<Record<string, unknown>>(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options?.headers,
    },
  });

  if (!result.ok || !result.data) {
    console.error(`[mubasher] Failed to fetch ${symbol}: ${result.error}`);
    return null;
  }

  try {
    const data = result.data as Record<string, unknown>;
    const statements = (data.financialStatement ?? data.rows ?? []) as Array<
      Record<string, unknown>
    >;

    if (statements.length === 0) {
      console.warn(`[mubasher] No financial statements for ${symbol}`);
      return null;
    }

    // Get the most recent balance sheet
    const latest = statements[0];
    const bs =
      (latest.balanceSheet as Record<string, unknown>) ??
      (latest as Record<string, unknown>);

    return {
      totalAssets: parseNum(bs.totalAssets),
      totalDebt: parseNum(bs.totalDebt ?? bs.totalLiabilities),
      cashAndEquivalents: parseNum(
        bs.cashAndCashEquivalents ?? bs.cashAndShortTermInvestments
      ),
      interestBearingDeposits: parseNum(bs.interestBearingDeposits),
      receivables: parseNum(
        bs.accountReceivables ?? bs.totalReceivables
      ),
      totalRevenue: parseNum(
        (latest.incomeStatement as Record<string, unknown>)?.totalRevenue ??
          bs.totalRevenue
      ),
      fiscalYear:
        (latest.fiscalYear as number) ??
        (latest.year as number) ??
        new Date().getFullYear(),
    };
  } catch (error) {
    console.error(
      `[mubasher] Parse error for ${symbol}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

function parseNum(value: unknown): number | null {
  if (value == null) return null;
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  return isNaN(num) ? null : num;
}
