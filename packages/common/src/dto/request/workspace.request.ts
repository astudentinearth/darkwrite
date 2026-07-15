/* eslint-disable @typescript-eslint/no-empty-object-type */

import { z } from "zod";

export const ZNoteSortMode = z.enum(["lastModified", "alphabetical"]);

export const CreateWorkspaceDTOSchema = z.object({
  name: z.string(),
  iconUrl: z.string().optional(),
  allNotesSortMode: ZNoteSortMode.optional(),
});

export interface CreateWorkspaceDTO
  extends z.infer<typeof CreateWorkspaceDTOSchema> {}

export const UpdateWorkspaceDTOSchema = z.object({
  name: z.string().optional(),
  iconUrl: z.string().nullable().optional(),
  allNotesSortMode: ZNoteSortMode.optional(),
});

export interface UpdateWorkspaceDTO
  extends z.infer<typeof UpdateWorkspaceDTOSchema> {}
