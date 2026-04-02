CREATE TABLE `stock_analyses` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`stock_id` text NOT NULL,
	`language_code` text DEFAULT 'en' NOT NULL,
	`content` text NOT NULL,
	`model` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`trigger_reason` text
);
