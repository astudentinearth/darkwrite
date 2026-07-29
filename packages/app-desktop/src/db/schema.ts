import { randomUUID } from "node:crypto";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { PatchPartial } from "./sql";

const generatedUuid = () =>
  text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID());

const bool = () => integer({ mode: "boolean" });
const timestamp = (name?: string) =>
  name ? integer(name, { mode: "timestamp" }) : integer({ mode: "timestamp" });
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
  ownerId: text(),
  name: text().notNull(),
  iconUrl: text(),
  createdAt: timestamp().notNull(),
  config: json(),
});

export const note = sqliteTable("note", {
  id: generatedUuid(),
  userId: text(),
  parentId: text(), // FIXME: on delete set null here please
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
  workspaceId: text()
    .references(() => workspace.id, { onDelete: "cascade" })
    .notNull(),
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

export const linkedFile = sqliteTable("linked_file", {
  id: generatedUuid(),
  filePath: text().notNull(),
});

export type Workspace = typeof workspace.$inferSelect;
export type NewWorkspace = typeof workspace.$inferInsert;
export type PatchWorkspace = PatchPartial<Workspace, "id">;

export type NoteRow = typeof note.$inferSelect;
export type NewNoteRow = typeof note.$inferInsert;
export type PatchNoteRow = PatchPartial<NoteRow, "id">;

export type Database = typeof database.$inferSelect;
export type NewDatabase = typeof database.$inferInsert;
export type PatchDatabase = PatchPartial<Database, "id">;

export type EmbedRow = typeof embed.$inferSelect;
export type NewEmbedRow = typeof embed.$inferInsert;
export type PatchEmbedRow = PatchPartial<EmbedRow, "id">;

export type LinkedFileRow = typeof linkedFile.$inferSelect;
export type NewLinkedFileRow = typeof linkedFile.$inferInsert;
