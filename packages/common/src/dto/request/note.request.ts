import { z } from "zod";

export const CreateNoteDTOSchema = z.object({
  title: z.string(),
  parentId: z.string().nullable(),
  icon: z.string().nullable().optional(),
  databaseId: z.string().nullable().optional(),
  workspaceId: z.string(),
});

export type CreateNoteDTO = z.infer<typeof CreateNoteDTOSchema>;

export const UpdateNoteDTOSchema = z.object({
  title: z.string().optional(),
  icon: z.string().nullable().optional(),
  databaseId: z.string().nullable().optional(),
  propertyValues: z.record(z.string(), z.string()).nullable().optional(),
});

export type UpdateNoteDTO = z.infer<typeof UpdateNoteDTOSchema>;

/** @deprecated */
export const MoveNoteDTOSchema = z.object({
  workspaceId: z.string().optional(),
  sourceId: z.string(),
  destinationId: z.string().nullable(),
  placement: z.enum(["below", "inside-start", "inside-end"]),
});

/** @deprecated */
export type MoveNoteDTO = z.infer<typeof MoveNoteDTOSchema>;
