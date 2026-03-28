import {
  sqliteTable,
  AnySQLiteColumn,
  text,
  numeric,
  foreignKey,
  integer,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { PatchPartial } from "./sql";

const generatedUuid = () =>
  text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID());

const bool = () => integer({ mode: "boolean" });
const timestamp = () => integer({ mode: "timestamp" });
const json = () => text({ mode: "json" });

export const database = sqliteTable("database", {
  id: generatedUuid(),
  userId: text(),
  name: text().notNull(),
  workspaceId: text().notNull(),
  createdAt: timestamp().notNull(),
  propertySchema: json(),
});

export const workspace = sqliteTable("workspace", {
  id: generatedUuid(),
  ownerId: text("owner_id"),
  name: text().notNull(),
  iconUrl: text("icon_url"),
  createdAt: timestamp().notNull(),
  config: json(),
});

export const note = sqliteTable("note", {
  id: generatedUuid(),
  userId: text(),
  parentId: text(),
  propertyValues: json(),
  title: text().notNull(),
  icon: text(),
  createdAt: timestamp().notNull(),
  modifiedAt: timestamp().notNull(),
  trashedAt: timestamp(),
  isFavorite: bool(),
  isTrashed: bool(),
  favoriteOrderHint: text().notNull(),
  orderHint: text().notNull(),
  databaseId: text().references(() => database.id),
  workspaceId: text().references(() => workspace.id, { onDelete: "cascade" }).notNull(),
});

export const embed = sqliteTable("embed", {
  id: text().primaryKey().notNull(),
  ownerId: text(),
  fileType: text().notNull(),
  fileSize: integer().notNull(),
  displayName: text(),
  fileName: text().notNull(),
  uploadedAt: timestamp().notNull(),
  workspaceId: text().references(() => workspace.id, { onDelete: "set null" }),
});

export type Workspace = typeof workspace.$inferSelect;
export type NewWorkspace = typeof workspace.$inferInsert;
export type PatchWorkspace = PatchPartial<Workspace, "id">;

export type Note = typeof note.$inferSelect;
export type NewNote = typeof note.$inferInsert;
export type PatchNote = PatchPartial<Note, "id">;

export type Database = typeof database.$inferSelect;
export type NewDatabase = typeof database.$inferInsert;
export type PatchDatabase = PatchPartial<Database, "id">;

export type Embed = typeof embed.$inferSelect;
export type NewEmbed = typeof embed.$inferInsert;
export type PatchEmbed = PatchPartial<Embed, "id">;
