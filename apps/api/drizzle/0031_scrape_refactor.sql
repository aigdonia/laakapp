-- Refactor data_sources: replace type/countryCodes/config/rateLimitMs/maxRetries with params/schedule
-- SQLite doesn't support DROP COLUMN before 3.35.0, so we recreate the tables.

-- Step 1: Recreate data_sources
CREATE TABLE `data_sources_new` (
  `id` text PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `url_template` text DEFAULT '' NOT NULL,
  `params` text DEFAULT '[]' NOT NULL,
  `schedule` text,
  `enabled` integer DEFAULT true NOT NULL,
  `last_run_at` text,
  `last_run_status` text
);
--> statement-breakpoint
INSERT INTO `data_sources_new` (`id`, `created_at`, `updated_at`, `name`, `slug`, `url_template`, `params`, `enabled`, `last_run_at`, `last_run_status`)
  SELECT `id`, `created_at`, `updated_at`, `name`, `slug`, `url_template`, '[]', `enabled`, `last_run_at`, `last_run_status`
  FROM `data_sources`;
--> statement-breakpoint
DROP TABLE `data_sources`;
--> statement-breakpoint
ALTER TABLE `data_sources_new` RENAME TO `data_sources`;
--> statement-breakpoint
CREATE UNIQUE INDEX `data_sources_slug_unique` ON `data_sources` (`slug`);

-- Step 2: Recreate scrape_jobs
--> statement-breakpoint
CREATE TABLE `scrape_jobs_new` (
  `id` text PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL,
  `data_source_id` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `params` text DEFAULT '{}' NOT NULL,
  `progress` text DEFAULT '{"total":0,"completed":0,"failed":0,"errors":[]}' NOT NULL,
  `started_at` text,
  `completed_at` text,
  `error_message` text,
  `log_key` text,
  `created_by` text DEFAULT 'admin' NOT NULL
);
--> statement-breakpoint
INSERT INTO `scrape_jobs_new` (`id`, `created_at`, `updated_at`, `data_source_id`, `status`, `params`, `progress`, `started_at`, `completed_at`, `error_message`, `created_by`)
  SELECT `id`, `created_at`, `updated_at`, `data_source_id`, `status`, '{}', `progress`, `started_at`, `completed_at`, `error_message`, `created_by`
  FROM `scrape_jobs`;
--> statement-breakpoint
DROP TABLE `scrape_jobs`;
--> statement-breakpoint
ALTER TABLE `scrape_jobs_new` RENAME TO `scrape_jobs`;
