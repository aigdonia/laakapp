CREATE TABLE `lookups` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`category` text NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`translations` text DEFAULT '{}' NOT NULL
);
