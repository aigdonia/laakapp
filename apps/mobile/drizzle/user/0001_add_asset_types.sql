-- SQLite cannot ALTER COLUMN to drop NOT NULL, so we recreate the holdings table.
-- Step 1: Create new table with updated schema
CREATE TABLE `holdings_new` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL DEFAULT 'stock',
	`symbol` text,
	`name` text NOT NULL,
	`exchange` text,
	`quantity` real NOT NULL,
	`cost_per_unit` real NOT NULL DEFAULT 0,
	`total_cost` real,
	`currency` text NOT NULL DEFAULT 'EGP',
	`unit` text,
	`purity` text,
	`profit_rate` real,
	`maturity_date` integer,
	`estimated_value` real,
	`metadata` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
-- Step 2: Copy existing data (map old columns to new names)
INSERT INTO `holdings_new` (`id`, `type`, `symbol`, `name`, `exchange`, `quantity`, `cost_per_unit`, `total_cost`, `currency`, `created_at`, `updated_at`)
SELECT `id`, 'stock', `symbol`, `name`, `exchange`, `shares`, `avg_cost_per_share`, `shares` * `avg_cost_per_share`, `currency`, `created_at`, `updated_at`
FROM `holdings`;
--> statement-breakpoint
-- Step 3: Drop old table
DROP TABLE `holdings`;
--> statement-breakpoint
-- Step 4: Rename new table
ALTER TABLE `holdings_new` RENAME TO `holdings`;
--> statement-breakpoint
-- Step 5: Recreate transactions table with renamed columns and new fields.
-- Foreign key references holdings(id) which now exists as the renamed table.
CREATE TABLE `transactions_new` (
	`id` text PRIMARY KEY NOT NULL,
	`holding_id` text NOT NULL,
	`type` text NOT NULL,
	`quantity` real NOT NULL,
	`price_per_unit` real NOT NULL,
	`fees` real DEFAULT 0,
	`notes` text,
	`date` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`holding_id`) REFERENCES `holdings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
-- Step 6: Copy existing transaction data
INSERT INTO `transactions_new` (`id`, `holding_id`, `type`, `quantity`, `price_per_unit`, `date`, `created_at`)
SELECT `id`, `holding_id`, `type`, `shares`, `price_per_share`, `date`, `created_at`
FROM `transactions`;
--> statement-breakpoint
-- Step 7: Drop old transactions table
DROP TABLE `transactions`;
--> statement-breakpoint
-- Step 8: Rename
ALTER TABLE `transactions_new` RENAME TO `transactions`;
