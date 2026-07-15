ALTER TABLE `workspace` ADD `favoriteIds` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `workspace` ADD `allNotesSortMode` text DEFAULT 'lastModified' NOT NULL;--> statement-breakpoint
ALTER TABLE `workspace` DROP COLUMN `ownerId`;--> statement-breakpoint
ALTER TABLE `workspace` DROP COLUMN `config`;