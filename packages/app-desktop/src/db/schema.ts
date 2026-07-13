import { randomUUID } from "node:crypto";
import type { DatabaseViewType } from "@darkwrite/common";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
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
const noteType = () => text({ enum: ["doc", "database", "database_view"] });

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
  parentId: text(), // FIXME: on delete set null here please
  title: text().notNull(),
  icon: text(),
  createdAt: timestamp().notNull(),
  modifiedAt: timestamp().notNull(),
  trashedAt: timestamp(),
  isFavorite: bool(),
  isTrashed: bool(),
  favoriteOrderHint: text().notNull(),
  orderHint: text().notNull(),
  workspaceId: text()
    .references(() => workspace.id, { onDelete: "cascade" })
    .notNull(),
  type: noteType().notNull().default("doc"),
});

const fk_note = () => text().references(() => note.id, { onDelete: "cascade" });

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

const databaseViewType = () =>
  text({ enum: ["table", "board", "calendar"] }).$type<DatabaseViewType>();

/** View-specific metadata for a note of type "database_view" */
export const databaseView = sqliteTable("database_view", {
  id: fk_note().primaryKey().notNull(),
  type: databaseViewType().notNull(),
});

const propertyFieldType = () =>
  text({ enum: ["text", "select", "multi_select", "checkbox", "date"] });

export const propertyDefinition = sqliteTable("property_def", {
  id: generatedUuid(),
  name: text().notNull().default(""),
  type: propertyFieldType().notNull().default("text"),
  config: json(),
  databaseId: fk_note().notNull(),
});

export const propertyValue = sqliteTable(
  "property_value",
  {
    propertyId: text()
      .references(() => propertyDefinition.id, { onDelete: "cascade" })
      .notNull(),
    noteId: fk_note().notNull(),
    value: json(),
  },
  (t) => [uniqueIndex("uq_property_value_note").on(t.propertyId, t.noteId)],
);

export type Workspace = typeof workspace.$inferSelect;
export type NewWorkspace = typeof workspace.$inferInsert;
export type PatchWorkspace = PatchPartial<Workspace, "id">;

export type Note = typeof note.$inferSelect;
export type NewNote = typeof note.$inferInsert;
export type PatchNote = PatchPartial<Note, "id">;

export type Embed = typeof embed.$inferSelect;
export type NewEmbed = typeof embed.$inferInsert;
export type PatchEmbed = PatchPartial<Embed, "id">;

export type LinkedFile = typeof linkedFile.$inferSelect;
export type NewLinkedFile = typeof linkedFile.$inferInsert;

export type DatabaseViewRow = typeof databaseView.$inferSelect;
export type NewDatabaseViewRow = typeof databaseView.$inferInsert;

export type PropertyDefRow = typeof propertyDefinition.$inferSelect;
export type NewPropertyDefRow = typeof propertyDefinition.$inferInsert;
