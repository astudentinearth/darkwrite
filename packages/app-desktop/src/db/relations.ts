import { relations } from "drizzle-orm/relations";
import { embed, note, workspace } from "./schema";

export const noteRelations = relations(note, ({ one }) => ({
  workspace: one(workspace, {
    fields: [note.workspaceId],
    references: [workspace.id],
  }),
}));

export const workspaceRelations = relations(workspace, ({ many }) => ({
  notes: many(note),
  embeds: many(embed),
}));

export const embedRelations = relations(embed, ({ one }) => ({
  workspace: one(workspace, {
    fields: [embed.workspaceId],
    references: [workspace.id],
  }),
}));
