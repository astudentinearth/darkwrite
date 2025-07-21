import { WorkspaceConfig } from "@/lib/workspace-config";

export interface WorkspaceDTO {
  id: string;
  owner_id?: string;
  name: string;
  icon_url?: string;
  created_at: Date;
  config: WorkspaceConfig;
}

export interface WorkspaceResponseDTO {
  workspace: WorkspaceDTO;
}

export interface WorkspacesResponseDTO {
  workspaces: WorkspaceDTO[];
}