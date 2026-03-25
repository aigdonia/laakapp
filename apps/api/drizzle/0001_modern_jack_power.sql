CREATE TABLE `asset_classes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `asset_classes_slug_unique` ON `asset_classes` (`slug`);