import { sqliteTable, AnySQLiteColumn, text, numeric, foreignKey, integer } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const database = sqliteTable("database", {
	id: text().primaryKey().notNull(),
	userId: text(),
	name: text().notNull(),
	workspaceId: text().notNull(),
	createdAt: numeric().notNull(),
	propertySchema: text(),
});

export const workspace = sqliteTable("workspace", {
	id: text().primaryKey().notNull(),
	ownerId: text("owner_id"),
	name: text().notNull(),
	iconUrl: text("icon_url"),
	createdAt: numeric("created_at").notNull(),
	config: text(),
});

export const note = sqliteTable("note", {
	id: text().primaryKey().notNull(),
	userId: text(),
	parentId: text(),
	propertyValues: text(),
	title: text().notNull(),
	icon: text(),
	createdAt: numeric().notNull(),
	modifiedAt: numeric().notNull(),
	trashedAt: numeric(),
	isFavorite: numeric(),
	isTrashed: numeric(),
	favoriteOrderHint: text().notNull(),
	orderHint: text().notNull(),
	databaseId: text().references(() => database.id),
	workspaceId: text().references(() => workspace.id, { onDelete: "cascade" } ),
});

export const embed = sqliteTable("embed", {
	id: text().primaryKey().notNull(),
	ownerId: text(),
	fileType: text().notNull(),
	fileSize: integer().notNull(),
	displayName: text(),
	fileName: text().notNull(),
	uploadedAt: numeric().notNull(),
	workspaceId: text().references(() => workspace.id, { onDelete: "set null" } ),
});

