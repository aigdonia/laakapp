-- 1. Create scrape_executions table
CREATE TABLE `scrape_executions` (
  `id` text PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL,
  `job_id` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `progress` text DEFAULT '{"total":0,"completed":0,"failed":0,"errors":[]}' NOT NULL,
  `started_at` text,
  `completed_at` text,
  `error_message` text,
  `log_key` text,
  `trigger` text DEFAULT 'manual' NOT NULL
);

-- 2. Recreate scrape_jobs as definition-only
--> statement-breakpoint
CREATE TABLE `scrape_jobs_new` (
  `id` text PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL,
  `data_source_id` text NOT NULL,
  `params` text DEFAULT '{}' NOT NULL,
  `schedule` text,
  `enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
INSERT INTO `scrape_jobs_new` (`id`, `created_at`, `updated_at`, `data_source_id`, `params`)
  SELECT `id`, `created_at`, `updated_at`, `data_source_id`, `params` FROM `scrape_jobs`;
--> statement-breakpoint
DROP TABLE `scrape_jobs`;
--> statement-breakpoint
ALTER TABLE `scrape_jobs_new` RENAME TO `scrape_jobs`;

-- 3. Clean up data_sources (remove schedule/lastRun)
--> statement-breakpoint
CREATE TABLE `data_sources_new` (
  `id` text PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `url_template` text DEFAULT '' NOT NULL,
  `params` text DEFAULT '[]' NOT NULL,
  `enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
INSERT INTO `data_sources_new` (`id`, `created_at`, `updated_at`, `name`, `slug`, `url_template`, `params`, `enabled`)
  SELECT `id`, `created_at`, `updated_at`, `name`, `slug`, `url_template`, `params`, `enabled` FROM `data_sources`;
--> statement-breakpoint
DROP TABLE `data_sources`;
--> statement-breakpoint
ALTER TABLE `data_sources_new` RENAME TO `data_sources`;
--> statement-breakpoint
CREATE UNIQUE INDEX `data_sources_slug_unique` ON `data_sources` (`slug`);
