import { z } from "zod";

export const UpdateNoteDTOSchema = z.object({
  title: z.string().optional(),
  icon: z.string().nullable().optional(),
  databaseId: z.string().nullable().optional(),
  propertyValues: z.record(z.string(), z.string()).nullable().optional(),
});

export type UpdateNoteDTO = z.infer<typeof UpdateNoteDTOSchema>;
