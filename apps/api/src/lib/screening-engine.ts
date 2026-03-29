import type {
  ComplianceStatus,
  ScreeningLayer,
} from "@fin-ai/shared";

export interface ScreeningInput {
  sector: string;
  haramSectors: string[];
  indexMemberships: string[];
  financials: {
    totalDebt: number | null;
    cashAndEquivalents: number | null;
    interestBearingDeposits: number | null;
    receivables: number | null;
    marketCap: number | null;
    totalAssets: number | null;
    totalRevenue: number | null;
    nonPermissibleRevenue: number | null;
  } | null;
  thresholds: Record<string, number>;
  /** "market_cap" or "total_assets" — determines ratio denominator */
  denominatorType: "market_cap" | "total_assets";
}

export interface ScreeningResult {
  status: ComplianceStatus;
  layer: ScreeningLayer;
  ratios: {
    debtRatio: number | null;
    cashInterestRatio: number | null;
    receivablesRatio: number | null;
    nonPermissibleIncomeRatio: number | null;
  };
}

function safeRatio(
  numerator: number | null | undefined,
  denominator: number | null | undefined
): number | null {
  if (
    numerator == null ||
    denominator == null ||
    denominator === 0
  )
    return null;
  return numerator / denominator;
}

/**
 * Pure screening function — no I/O.
 * Implements the 3-layer screening pyramid:
 *   1. Sector filter (haram sectors → non_compliant)
 *   2. Index membership (on official Sharia index → compliant)
 *   3. Financial ratio screening (compare to thresholds)
 */
export function screenStock(input: ScreeningInput): ScreeningResult {
  const nullRatios = {
    debtRatio: null,
    cashInterestRatio: null,
    receivablesRatio: null,
    nonPermissibleIncomeRatio: null,
  };

  // Layer 1: Sector filter
  const sectorLower = input.sector.toLowerCase().replace(/[\s-]+/g, "_");
  if (
    input.haramSectors.some(
      (s) => s.toLowerCase().replace(/[\s-]+/g, "_") === sectorLower
    )
  ) {
    return {
      status: "non_compliant",
      layer: "sector",
      ratios: nullRatios,
    };
  }

  // Layer 2: Index membership
  if (input.indexMemberships.length > 0) {
    return {
      status: "compliant",
      layer: "index",
      ratios: nullRatios,
    };
  }

  // Layer 3: Financial screening
  if (!input.financials) {
    return {
      status: "not_screened",
      layer: "financial",
      ratios: nullRatios,
    };
  }

  const f = input.financials;
  const denominator =
    input.denominatorType === "market_cap" ? f.marketCap : f.totalAssets;

  const debtRatio = safeRatio(f.totalDebt, denominator);
  const cashInterestRatio = safeRatio(
    (f.cashAndEquivalents ?? 0) + (f.interestBearingDeposits ?? 0),
    denominator
  );
  const receivablesRatio = safeRatio(f.receivables, denominator);
  const nonPermissibleIncomeRatio = safeRatio(
    f.nonPermissibleRevenue,
    f.totalRevenue
  );

  const ratios = {
    debtRatio,
    cashInterestRatio,
    receivablesRatio,
    nonPermissibleIncomeRatio,
  };

  // Check thresholds — if any ratio exceeds threshold, non-compliant
  const t = input.thresholds;

  if (debtRatio !== null && t.max_debt_ratio != null && debtRatio > t.max_debt_ratio) {
    return { status: "non_compliant", layer: "financial", ratios };
  }

  if (
    cashInterestRatio !== null &&
    t.max_cash_interest_ratio != null &&
    cashInterestRatio > t.max_cash_interest_ratio
  ) {
    return { status: "non_compliant", layer: "financial", ratios };
  }

  if (
    receivablesRatio !== null &&
    t.max_receivables_ratio != null &&
    receivablesRatio > t.max_receivables_ratio
  ) {
    return { status: "non_compliant", layer: "financial", ratios };
  }

  if (
    nonPermissibleIncomeRatio !== null &&
    t.max_non_permissible_income_ratio != null &&
    nonPermissibleIncomeRatio > t.max_non_permissible_income_ratio
  ) {
    return { status: "non_compliant", layer: "financial", ratios };
  }

  // If any ratio couldn't be calculated, mark doubtful
  if (debtRatio === null || cashInterestRatio === null || receivablesRatio === null) {
    return { status: "doubtful", layer: "financial", ratios };
  }

  return { status: "compliant", layer: "financial", ratios };
}
