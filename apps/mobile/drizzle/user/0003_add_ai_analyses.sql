CREATE TABLE IF NOT EXISTS `ai_analyses` (
	`id` text PRIMARY KEY NOT NULL,
	`holding_key` text NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`credit_transaction_id` text,
	`created_at` integer NOT NULL
);
