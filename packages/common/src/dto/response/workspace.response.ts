import { WorkspaceConfig } from "@/workspace-config";

export interface WorkspaceDTO {
  id: string;
  owner_id?: string;
  name: string;
  icon_url?: string | null;
  created_at: string;
  config: WorkspaceConfig;
}

export interface WorkspaceResponseDTO {
  workspace: WorkspaceDTO;
}

export interface WorkspacesResponseDTO {
  workspaces: WorkspaceDTO[];
}
