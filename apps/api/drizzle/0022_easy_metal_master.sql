CREATE TABLE `backup_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`transaction_count` integer NOT NULL,
	`size_bytes` integer NOT NULL,
	`schema_version` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
