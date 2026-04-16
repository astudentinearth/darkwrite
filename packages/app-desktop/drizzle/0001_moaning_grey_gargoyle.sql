PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workspace` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text,
	`name` text NOT NULL,
	`icon_url` text,
	`createdAt` integer NOT NULL,
	`config` text
);
--> statement-breakpoint
INSERT INTO `__new_workspace`("id", "owner_id", "name", "icon_url", "createdAt", "config") SELECT "id", "owner_id", "name", "icon_url", "created_at", "config" FROM `workspace`;--> statement-breakpoint
DROP TABLE `workspace`;--> statement-breakpoint
ALTER TABLE `__new_workspace` RENAME TO `workspace`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_database` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`name` text NOT NULL,
	`workspaceId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`propertySchema` text
);
--> statement-breakpoint
INSERT INTO `__new_database`("id", "userId", "name", "workspaceId", "createdAt", "propertySchema") SELECT "id", "userId", "name", "workspaceId", "createdAt", "propertySchema" FROM `database`;--> statement-breakpoint
DROP TABLE `database`;--> statement-breakpoint
ALTER TABLE `__new_database` RENAME TO `database`;--> statement-breakpoint
CREATE TABLE `__new_note` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`parentId` text,
	`propertyValues` text,
	`title` text NOT NULL,
	`icon` text,
	`createdAt` integer NOT NULL,
	`modifiedAt` integer NOT NULL,
	`trashedAt` integer,
	`isFavorite` integer,
	`isTrashed` integer,
	`favoriteOrderHint` text NOT NULL,
	`orderHint` text NOT NULL,
	`databaseId` text,
	`workspaceId` text NOT NULL,
	FOREIGN KEY (`databaseId`) REFERENCES `database`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_note`("id", "userId", "parentId", "propertyValues", "title", "icon", "createdAt", "modifiedAt", "trashedAt", "isFavorite", "isTrashed", "favoriteOrderHint", "orderHint", "databaseId", "workspaceId") SELECT "id", "userId", "parentId", "propertyValues", "title", "icon", "createdAt", "modifiedAt", "trashedAt", "isFavorite", "isTrashed", "favoriteOrderHint", "orderHint", "databaseId", "workspaceId" FROM `note`;--> statement-breakpoint
DROP TABLE `note`;--> statement-breakpoint
ALTER TABLE `__new_note` RENAME TO `note`;--> statement-breakpoint
CREATE TABLE `__new_embed` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` text,
	`fileType` text NOT NULL,
	`fileSize` integer NOT NULL,
	`displayName` text,
	`fileName` text NOT NULL,
	`uploadedAt` integer NOT NULL,
	`workspaceId` text,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_embed`("id", "ownerId", "fileType", "fileSize", "displayName", "fileName", "uploadedAt", "workspaceId") SELECT "id", "ownerId", "fileType", "fileSize", "displayName", "fileName", "uploadedAt", "workspaceId" FROM `embed`;--> statement-breakpoint
DROP TABLE `embed`;--> statement-breakpoint
ALTER TABLE `__new_embed` RENAME TO `embed`;
