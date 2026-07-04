CREATE TABLE `database_view` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `note`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `property_def` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`type` text DEFAULT 'text' NOT NULL,
	`config` text,
	`databaseId` text NOT NULL,
	FOREIGN KEY (`databaseId`) REFERENCES `note`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `property_value` (
	`propertyId` text NOT NULL,
	`noteId` text NOT NULL,
	`value` text,
	FOREIGN KEY (`propertyId`) REFERENCES `property_def`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`noteId`) REFERENCES `note`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_property_value_note` ON `property_value` (`propertyId`,`noteId`);
--> statement-breakpoint
DROP TABLE `database`;
--> statement-breakpoint
CREATE TABLE `__new_note` (
	`id` text PRIMARY KEY NOT NULL,
	`parentId` text,
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
	`type` text DEFAULT 'doc' NOT NULL,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_note`("id", "parentId", "title", "icon", "createdAt", "modifiedAt", "trashedAt", "isFavorite", "isTrashed", "favoriteOrderHint", "orderHint", "workspaceId") SELECT "id", "parentId", "title", "icon", "createdAt", "modifiedAt", "trashedAt", "isFavorite", "isTrashed", "favoriteOrderHint", "orderHint", "workspaceId" FROM `note`;--> statement-breakpoint
DROP TABLE `note`;
--> statement-breakpoint
ALTER TABLE `__new_note` RENAME TO `note`;
