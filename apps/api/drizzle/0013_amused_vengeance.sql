CREATE TABLE `exchange_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`currency` text NOT NULL,
	`rate_per_usd` real NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exchange_rates_currency_unique` ON `exchange_rates` (`currency`);