CREATE TABLE `onboarding_screens` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`type` text DEFAULT 'informative' NOT NULL,
	`slug` text NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`choices` text DEFAULT '[]' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`translations` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `onboarding_screens_slug_unique` ON `onboarding_screens` (`slug`);