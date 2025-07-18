import { WorkspaceConfig } from "@/lib/workspace-config";

export interface CreateWorkspaceDTO {
  name: string;
  icon_url?: string;
  config: WorkspaceConfig;
}