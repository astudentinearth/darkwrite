-- workspace
UPDATE workspace 
SET createdAt = CAST((julianday(createdAt) - 2440587.5) * 86400 AS INTEGER)
WHERE typeof(createdAt) = 'text';

--> statement-breakpoint
-- note
UPDATE note 
SET createdAt = CAST((julianday(createdAt) - 2440587.5) * 86400 AS INTEGER)
WHERE typeof(createdAt) = 'text';

--> statement-breakpoint
UPDATE note 
SET modifiedAt = CAST((julianday(modifiedAt) - 2440587.5) * 86400 AS INTEGER)
WHERE typeof(modifiedAt) = 'text';

--> statement-breakpoint
UPDATE note 
SET trashedAt = CAST((julianday(trashedAt) - 2440587.5) * 86400 AS INTEGER)
WHERE typeof(trashedAt) = 'text';

--> statement-breakpoint
-- embed
UPDATE embed 
SET uploadedAt = CAST((julianday(uploadedAt) - 2440587.5) * 86400 AS INTEGER)
WHERE typeof(uploadedAt) = 'text';

--> statement-breakpoint
-- database
UPDATE database 
SET createdAt = CAST((julianday(createdAt) - 2440587.5) * 86400 AS INTEGER)
WHERE typeof(createdAt) = 'text';
