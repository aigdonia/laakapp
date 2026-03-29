CREATE TABLE `activity_completions` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`rule_id` text NOT NULL,
	`completed_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `activity_events` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`event_type` text NOT NULL,
	`metadata` text DEFAULT '{}',
	`idempotency_key` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `activity_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`name` text NOT NULL,
	`event_type` text NOT NULL,
	`threshold` integer DEFAULT 1 NOT NULL,
	`action_type` text NOT NULL,
	`action_payload` text DEFAULT '{}' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event_types` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_types_slug_unique` ON `event_types` (`slug`);
--> statement-breakpoint
CREATE INDEX `idx_activity_events_customer_type` ON `activity_events` (`customer_id`, `event_type`);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_activity_completions_unique` ON `activity_completions` (`customer_id`, `rule_id`);