import { z } from "zod";
import { DatabaseViewType } from "@/note";

export const ZCreateDocumentRequest = z.object({
  title: z.string(),
  parentId: z.string().nullable(),
  icon: z.string().nullable().optional(),
  workspaceId: z.string(),
});

export type CreateDocumentRequest = z.infer<typeof ZCreateDocumentRequest>;
export type CreateDocumentArgs = z.input<typeof ZCreateDocumentRequest>;

export const ZCreateDatabaseViewRequest = z.object({
  databaseId: z.string(),
  type: z.enum(Object.values(DatabaseViewType)).default(DatabaseViewType.Table),
});

export type CreateDatabaseViewRequest = z.infer<
  typeof ZCreateDatabaseViewRequest
>;
export type CreateDatabaseViewArgs = z.input<typeof ZCreateDatabaseViewRequest>;

export const ZCreateDatabaseRequest = z.object({
  parentId: z.string().nullable().default(null),
  workspaceId: z.string(),
});

export type CreateDatabaseRequest = z.infer<typeof ZCreateDatabaseRequest>;
export type CreateDatabaseArgs = z.infer<typeof ZCreateDatabaseRequest>;

export const UpdateNoteDTOSchema = z.object({
  title: z.string().optional(),
  icon: z.string().nullable().optional(),
});

export type UpdateNoteDTO = z.infer<typeof UpdateNoteDTOSchema>;

export const MoveNoteDTOSchema = z.object({
  workspaceId: z.string().optional(),
  sourceId: z.string(),
  destinationId: z.string().nullable(),
  placement: z.enum(["below", "inside-start", "inside-end"]),
});

export type MoveNoteDTO = z.infer<typeof MoveNoteDTOSchema>;
