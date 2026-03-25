-- Transaction-first migration: holdings become computed views, transactions are self-describing.
-- Current data is 1:1 (one holding = one transaction), so the JOIN is safe.

-- Step 1: Create new self-describing transactions table
CREATE TABLE `transactions_new` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`quantity` real NOT NULL,
	`price_per_unit` real NOT NULL,
	`fees` real DEFAULT 0,
	`notes` text,
	`date` integer NOT NULL,
	`asset_type` text NOT NULL,
	`symbol` text,
	`name` text NOT NULL,
	`exchange` text,
	`currency` text NOT NULL DEFAULT 'EGP',
	`unit` text,
	`purity` text,
	`profit_rate` real,
	`maturity_date` text,
	`estimated_value` real,
	`metadata` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
-- Step 2: Copy existing transactions joined with holdings to populate identity fields
INSERT INTO `transactions_new` (
	`id`, `type`, `quantity`, `price_per_unit`, `fees`, `notes`, `date`,
	`asset_type`, `symbol`, `name`, `exchange`, `currency`,
	`unit`, `purity`, `profit_rate`, `maturity_date`, `estimated_value`, `metadata`,
	`created_at`
)
SELECT
	t.`id`, t.`type`, t.`quantity`, t.`price_per_unit`, t.`fees`, t.`notes`, t.`date`,
	h.`type`, h.`symbol`, h.`name`, h.`exchange`, h.`currency`,
	h.`unit`, h.`purity`, h.`profit_rate`, h.`maturity_date`, h.`estimated_value`, h.`metadata`,
	t.`created_at`
FROM `transactions` t
JOIN `holdings` h ON t.`holding_id` = h.`id`;
--> statement-breakpoint
-- Step 3: Drop old tables
DROP TABLE `transactions`;
--> statement-breakpoint
DROP TABLE `holdings`;
--> statement-breakpoint
-- Step 4: Rename
ALTER TABLE `transactions_new` RENAME TO `transactions`;
