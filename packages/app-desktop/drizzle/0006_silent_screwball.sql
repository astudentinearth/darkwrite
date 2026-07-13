CREATE TABLE `__new_property_value` (
	`propertyId` text NOT NULL,
	`noteId` text NOT NULL,
	`value` text,
	FOREIGN KEY (`propertyId`) REFERENCES `property_def`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`noteId`) REFERENCES `note`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_property_value`("propertyId", "noteId", "value") SELECT "propertyId", "noteId", "value" FROM `property_value`;
--> statement-breakpoint
DROP TABLE `property_value`;
--> statement-breakpoint
ALTER TABLE `__new_property_value` RENAME TO `property_value`;
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_property_value_note` ON `property_value` (`propertyId`,`noteId`);
