import { z } from "zod";

export const CreateNoteDTOSchema = z.object({
  title: z.string(),
  parentId: z.string().nullable(),
  icon: z.string().nullable().optional(),
  databaseId: z.string().nullable().optional(),
  workspaceId: z.string(),
  orderHint: z.string().optional(),
  favoriteOrderHint: z.string(),
});

export type CreateNoteDTO = z.infer<typeof CreateNoteDTOSchema>;

export const UpdateNoteDTOSchema = z.object({
  title: z.string().optional(),
  parentId: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  databaseId: z.string().nullable().optional(),
  workspaceId: z.string().nullable().optional(),
  propertyValues: z.record(z.string(), z.string()).nullable().optional(),
  isFavorite: z.boolean().nullable().optional(),
  isTrashed: z.boolean().nullable().optional(),
  orderHint: z.string().optional(),
  favoriteOrderHint: z.string().optional(),
});

export type UpdateNoteDTO = z.infer<typeof UpdateNoteDTOSchema>;
