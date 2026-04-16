-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TABLE IF NOT EXISTS `database` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`name` text NOT NULL,
	`workspaceId` text NOT NULL,
	`createdAt` numeric NOT NULL,
	`propertySchema` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `workspace` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text,
	`name` text NOT NULL,
	`icon_url` text,
	`created_at` numeric NOT NULL,
	`config` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `note` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`parentId` text,
	`propertyValues` text,
	`title` text NOT NULL,
	`icon` text,
	`createdAt` numeric NOT NULL,
	`modifiedAt` numeric NOT NULL,
	`trashedAt` numeric,
	`isFavorite` numeric,
	`isTrashed` numeric,
	`favoriteOrderHint` text NOT NULL,
	`orderHint` text NOT NULL,
	`databaseId` text,
	`workspaceId` text,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`databaseId`) REFERENCES `database`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `embed` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` text,
	`fileType` text NOT NULL,
	`fileSize` integer NOT NULL,
	`displayName` text,
	`fileName` text NOT NULL,
	`uploadedAt` numeric NOT NULL,
	`workspaceId` text,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE set null
);

