CREATE TABLE `affiliates` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`code` text NOT NULL,
	`commission_percent` real NOT NULL,
	`category` text DEFAULT '' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `affiliates_code_unique` ON `affiliates` (`code`);--> statement-breakpoint
CREATE TABLE `app_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`maintenance_mode` integer DEFAULT false NOT NULL,
	`default_language` text DEFAULT 'en' NOT NULL,
	`onboarding_enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`language_code` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `countries` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`currency` text NOT NULL,
	`flag_emoji` text DEFAULT '' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `countries_code_unique` ON `countries` (`code`);--> statement-breakpoint
CREATE TABLE `credit_packages` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`name` text NOT NULL,
	`credits` integer NOT NULL,
	`price_usd` real NOT NULL,
	`region` text DEFAULT '' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `languages` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`native_name` text NOT NULL,
	`direction` text DEFAULT 'ltr' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `languages_code_unique` ON `languages` (`code`);--> statement-breakpoint
CREATE TABLE `learning_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`trigger` text DEFAULT '' NOT NULL,
	`condition` text DEFAULT '' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`language_code` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `micro_lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`concept` text DEFAULT '' NOT NULL,
	`language_code` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `micro_lessons_slug_unique` ON `micro_lessons` (`slug`);--> statement-breakpoint
CREATE TABLE `prompts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`system_prompt` text DEFAULT '' NOT NULL,
	`model` text DEFAULT '' NOT NULL,
	`temperature` real DEFAULT 0.7 NOT NULL,
	`max_tokens` integer DEFAULT 1024 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prompts_slug_unique` ON `prompts` (`slug`);--> statement-breakpoint
CREATE TABLE `screening_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`methodology` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`thresholds` text DEFAULT '{}' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `screening_rules_slug_unique` ON `screening_rules` (`slug`);--> statement-breakpoint
CREATE TABLE `stocks` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`country_code` text NOT NULL,
	`exchange` text NOT NULL,
	`sector` text DEFAULT '' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stocks_symbol_unique` ON `stocks` (`symbol`);