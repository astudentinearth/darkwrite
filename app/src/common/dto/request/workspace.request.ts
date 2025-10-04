import { WorkspaceConfig, WorkspaceConfigSchema } from "@/lib/workspace-config";
import {z} from "zod";

export interface CreateWorkspaceDTO {
  name: string;
  icon_url?: string;
  config: WorkspaceConfig;
}

export const UpdateWorkspaceDTOSchema = z.object({
  name: z.string().optional(),
  icon_url: z.string().nullable().optional(),
  config: WorkspaceConfigSchema.partial().optional()
});

export type UpdateWorkspaceDTO = z.infer<typeof UpdateWorkspaceDTOSchema>;

