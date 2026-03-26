CREATE TABLE `notification_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`notification_id` text NOT NULL,
	`expo_token` text NOT NULL,
	`status` text NOT NULL,
	`error_message` text
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`category` text NOT NULL,
	`deep_link` text,
	`target` text DEFAULT 'all' NOT NULL,
	`scheduled_at` text,
	`sent_at` text,
	`status` text DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `push_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`user_id` text NOT NULL,
	`expo_token` text NOT NULL,
	`platform` text NOT NULL,
	`prefs` text DEFAULT '{"marketing":true,"content":true,"onboarding":true}' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `push_tokens_expo_token_unique` ON `push_tokens` (`expo_token`);