CREATE TABLE `markets` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`country_code` text NOT NULL,
	`currency` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`translations` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `markets_code_unique` ON `markets` (`code`);