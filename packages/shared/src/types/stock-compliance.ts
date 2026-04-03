import type { BaseEntity } from "./base";

export type ComplianceStatus =
  | "compliant"
  | "non_compliant"
  | "doubtful"
  | "not_screened";

export type ScreeningLayer = "sector" | "index" | "financial" | "manual";

export type ComplianceSource = "auto" | "manual_override";

export interface StockCompliance extends BaseEntity {
  stockId: string;
  screeningRuleId: string;
  status: ComplianceStatus;
  layer: ScreeningLayer;
  debtRatio: number | null;
  cashInterestRatio: number | null;
  receivablesRatio: number | null;
  nonPermissibleIncomeRatio: number | null;
  source: ComplianceSource;
  notes: string;
  validFrom: string;
  validUntil: string | null;
}

export type FiscalPeriod = "annual" | "q1" | "q2" | "q3" | "q4";
export type FinancialSource = "stockanalysis" | "mubasher" | "manual";

export interface StockFinancial extends BaseEntity {
  stockId: string;
  fiscalYear: number;
  fiscalPeriod: FiscalPeriod;
  source: FinancialSource;
  totalAssets: number | null;
  totalDebt: number | null;
  cashAndEquivalents: number | null;
  interestBearingDeposits: number | null;
  receivables: number | null;
  marketCap: number | null;
  totalRevenue: number | null;
  nonPermissibleRevenue: number | null;
  rawData: Record<string, unknown>;
  fetchedAt: string;
}

export type DataSourceType =
  | "scraper"
  | "index_list"
  | "etf_holdings"
  | "manual_csv";

export interface DataSource extends BaseEntity {
  name: string;
  slug: string;
  type: DataSourceType;
  urlTemplate: string;
  countryCodes: string[];
  config: Record<string, unknown>;
  rateLimitMs: number;
  maxRetries: number;
  enabled: boolean;
  lastRunAt: string | null;
  lastRunStatus: string | null;
}

export type ScrapeJobStatus = "pending" | "running" | "completed" | "failed";
export type ScrapeJobType = "full_refresh" | "incremental" | "single_stock" | "price_update";
export type ScrapeJobCreator = "admin" | "cron" | "system";

export interface ScrapeJobProgress {
  total: number;
  completed: number;
  failed: number;
  errors: string[];
}

export interface ScrapeJob extends BaseEntity {
  dataSourceId: string;
  status: ScrapeJobStatus;
  jobType: ScrapeJobType;
  targetSymbols: string[] | null;
  progress: ScrapeJobProgress;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  createdBy: ScrapeJobCreator;
}

/** Lean compliance result for mobile endpoint */
export interface StockComplianceLean {
  status: ComplianceStatus;
  layer: ScreeningLayer;
  ratios: {
    debtRatio: number | null;
    cashInterestRatio: number | null;
    receivablesRatio: number | null;
    nonPermissibleIncomeRatio: number | null;
  };
}
