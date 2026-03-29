CREATE TABLE `data_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`url_template` text DEFAULT '' NOT NULL,
	`country_codes` text DEFAULT '[]' NOT NULL,
	`config` text DEFAULT '{}' NOT NULL,
	`rate_limit_ms` integer DEFAULT 3000 NOT NULL,
	`max_retries` integer DEFAULT 3 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`last_run_at` text,
	`last_run_status` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `data_sources_slug_unique` ON `data_sources` (`slug`);--> statement-breakpoint
CREATE TABLE `scrape_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`data_source_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`job_type` text NOT NULL,
	`target_symbols` text DEFAULT 'null',
	`progress` text DEFAULT '{"total":0,"completed":0,"failed":0,"errors":[]}' NOT NULL,
	`started_at` text,
	`completed_at` text,
	`error_message` text,
	`created_by` text DEFAULT 'admin' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stock_compliance` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`stock_id` text NOT NULL,
	`screening_rule_id` text NOT NULL,
	`status` text DEFAULT 'not_screened' NOT NULL,
	`layer` text NOT NULL,
	`debt_ratio` real,
	`cash_interest_ratio` real,
	`receivables_ratio` real,
	`non_permissible_income_ratio` real,
	`source` text DEFAULT 'auto' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`valid_from` text NOT NULL,
	`valid_until` text
);
--> statement-breakpoint
CREATE TABLE `stock_financials` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`stock_id` text NOT NULL,
	`fiscal_year` integer NOT NULL,
	`fiscal_period` text NOT NULL,
	`source` text NOT NULL,
	`total_assets` real,
	`total_debt` real,
	`cash_and_equivalents` real,
	`interest_bearing_deposits` real,
	`receivables` real,
	`market_cap` real,
	`total_revenue` real,
	`non_permissible_revenue` real,
	`raw_data` text DEFAULT '{}',
	`fetched_at` text DEFAULT (current_timestamp) NOT NULL
);
