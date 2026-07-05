import { z } from "zod";
import { NoteType } from "@/note";

export const CreateNoteDTOSchema = z.object({
  title: z.string(),
  parentId: z.string().nullable(),
  icon: z.string().nullable().optional(),
  workspaceId: z.string(),
  /** Type of the note. Default is "doc" */
  type: z.enum(Object.values(NoteType)).default(NoteType.Doc),
});

export type CreateNoteDTO = z.infer<typeof CreateNoteDTOSchema>;
export type CreateNoteDTOInput = z.input<typeof CreateNoteDTOSchema>;

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
