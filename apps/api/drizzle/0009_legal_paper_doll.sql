CREATE TABLE `credit_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`feature` text NOT NULL,
	`amount` integer NOT NULL,
	`balance_after` integer,
	`status` text DEFAULT 'completed' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
