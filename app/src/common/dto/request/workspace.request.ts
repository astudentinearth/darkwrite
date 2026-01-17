import { WorkspaceConfigSchema } from "@/lib/workspace-config";
import { z } from "zod";

export const CreateWorkspaceDTOSchema = z.object({
  name: z.string(),
  icon_url: z.string().optional(),
  config: WorkspaceConfigSchema,
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateWorkspaceDTO
  extends z.infer<typeof CreateWorkspaceDTOSchema> {}

export const UpdateWorkspaceDTOSchema = z.object({
  name: z.string().optional(),
  icon_url: z.string().nullable().optional(),
  config: WorkspaceConfigSchema.partial().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdateWorkspaceDTO
  extends z.infer<typeof UpdateWorkspaceDTOSchema> {}
