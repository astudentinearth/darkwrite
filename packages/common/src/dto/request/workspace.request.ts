/* eslint-disable @typescript-eslint/no-empty-object-type */

import { z } from "zod";
import { WorkspaceConfigSchema } from "@/workspace-config";

export const CreateWorkspaceDTOSchema = z.object({
  name: z.string(),
  iconUrl: z.string().optional(),
  config: WorkspaceConfigSchema,
});

export interface CreateWorkspaceDTO
  extends z.infer<typeof CreateWorkspaceDTOSchema> {}

export const UpdateWorkspaceDTOSchema = z.object({
  name: z.string().optional(),
  iconUrl: z.string().nullable().optional(),
  config: WorkspaceConfigSchema.partial().optional(),
});

export interface UpdateWorkspaceDTO
  extends z.infer<typeof UpdateWorkspaceDTOSchema> {}
