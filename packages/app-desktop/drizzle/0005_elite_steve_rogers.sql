DROP TABLE `database`;
--> statement-breakpoint

CREATE TABLE `__new_note` (
	`id` text PRIMARY KEY NOT NULL,
	`parentId` text,
	`properties` text DEFAULT '{}' NOT NULL,
	`title` text NOT NULL,
	`icon` text,
	`createdAt` integer NOT NULL,
	`modifiedAt` integer NOT NULL,
	`trashedAt` integer,
	`isFavorite` integer,
	`isTrashed` integer,
	`favoriteOrderHint` text NOT NULL,
	`orderHint` text NOT NULL,
	`workspaceId` text NOT NULL,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

INSERT INTO `__new_note`("id", "parentId", "properties", "title", "icon", "createdAt", "modifiedAt", "trashedAt", "isFavorite", "isTrashed", "favoriteOrderHint", "orderHint", "workspaceId") SELECT "id", "parentId", '{}', "title", "icon", "createdAt", "modifiedAt", "trashedAt", "isFavorite", "isTrashed", "favoriteOrderHint", "orderHint", "workspaceId" FROM `note`;
--> statement-breakpoint

DROP TABLE `note`;
--> statement-breakpoint

ALTER TABLE `__new_note` RENAME TO `note`;
--> statement-breakpoint

ALTER TABLE `workspace` DROP COLUMN `ownerId`;
