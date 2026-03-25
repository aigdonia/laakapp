CREATE TABLE `article_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`icon` text DEFAULT '📄' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `article_categories_slug_unique` ON `article_categories` (`slug`);--> statement-breakpoint
ALTER TABLE `articles` ADD `category_id` text;--> statement-breakpoint
ALTER TABLE `asset_classes` ADD `aggregation_keys` text DEFAULT '[]' NOT NULL;