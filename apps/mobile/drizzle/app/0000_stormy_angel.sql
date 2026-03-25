CREATE TABLE `cached_prices` (
	`symbol` text PRIMARY KEY NOT NULL,
	`price` real NOT NULL,
	`change` real,
	`change_percent` real,
	`fetched_at` integer NOT NULL
);
