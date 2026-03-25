CREATE TABLE `translation_bundle_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`language_code` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `translation_bundle_versions_language_code_unique` ON `translation_bundle_versions` (`language_code`);--> statement-breakpoint
CREATE TABLE `ui_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`key` text NOT NULL,
	`namespace` text DEFAULT 'common' NOT NULL,
	`language_code` text NOT NULL,
	`value` text NOT NULL
);
