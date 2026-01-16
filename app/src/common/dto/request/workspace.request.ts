import { WorkspaceConfigSchema } from "@/lib/workspace-config";
import { z } from "zod";

export const CreateWorkspaceDTOSchema = z.object({
  name: z.string(),
  icon_url: z.string().optional(),
  config: WorkspaceConfigSchema,
});

export type CreateWorkspaceDTO = z.infer<typeof CreateWorkspaceDTOSchema>;

export const UpdateWorkspaceDTOSchema = z.object({
  name: z.string().optional(),
  icon_url: z.string().nullable().optional(),
  config: WorkspaceConfigSchema.partial().optional(),
});

export type UpdateWorkspaceDTO = z.infer<typeof UpdateWorkspaceDTOSchema>;
