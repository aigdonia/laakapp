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

export interface DataSourceParam {
  key: string;
  label: string;
  type: "string" | "number" | "enum";
  required: boolean;
  options?: Record<string, string>;
}

export interface DataSource extends BaseEntity {
  name: string;
  slug: string;
  urlTemplate: string;
  params: DataSourceParam[];
  enabled: boolean;
}

export interface ScrapeJob extends BaseEntity {
  dataSourceId: string;
  params: Record<string, string | number | null>;
  schedule: string | null;
  enabled: boolean;
}

export type ScrapeExecutionStatus = "pending" | "running" | "completed" | "failed";
export type ScrapeExecutionTrigger = "manual" | "cron" | "retry";

export interface ScrapeExecutionProgress {
  total: number;
  completed: number;
  failed: number;
  errors: string[];
}

export interface ScrapeExecution extends BaseEntity {
  jobId: string;
  status: ScrapeExecutionStatus;
  progress: ScrapeExecutionProgress;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  logKey: string | null;
  trigger: ScrapeExecutionTrigger;
}

/** Job with its latest execution for list views */
export interface ScrapeJobWithLastRun extends ScrapeJob {
  lastExecution: ScrapeExecution | null;
  dataSourceName?: string;
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
