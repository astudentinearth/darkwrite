import { WorkspaceConfig } from "@/lib/workspace-config";

export interface CreateWorkspaceDTO {
  name: string;
  icon_url?: string;
  config: WorkspaceConfig;
}

export interface UpdateWorkspaceDTO {
  name?: string;
  icon_url?: string;
  config?: WorkspaceConfig;
}