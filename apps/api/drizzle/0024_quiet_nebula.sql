CREATE TABLE `ai_features` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`credit_cost` integer DEFAULT 0 NOT NULL,
	`free_refresh` integer DEFAULT false NOT NULL,
	`prompt_slug` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_features_slug_unique` ON `ai_features` (`slug`);