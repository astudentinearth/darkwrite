import { relations } from "drizzle-orm/relations";
import { workspace, note, database, embed } from "./schema";

export const noteRelations = relations(note, ({ one }) => ({
  workspace: one(workspace, {
    fields: [note.workspaceId],
    references: [workspace.id],
  }),
  database: one(database, {
    fields: [note.databaseId],
    references: [database.id],
  }),
}));

export const workspaceRelations = relations(workspace, ({ many }) => ({
  notes: many(note),
  embeds: many(embed),
}));

export const databaseRelations = relations(database, ({ many }) => ({
  notes: many(note),
}));

export const embedRelations = relations(embed, ({ one }) => ({
  workspace: one(workspace, {
    fields: [embed.workspaceId],
    references: [workspace.id],
  }),
}));
