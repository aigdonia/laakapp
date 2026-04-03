ALTER TABLE `activity_rules` ADD `conditions` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `event_types` ADD `metadata_schema` text DEFAULT '[]' NOT NULL;