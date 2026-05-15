import { WorkspaceConfig } from "@/workspace-config";

export interface WorkspaceDTO {
  id: string;
  ownerId: string | null;
  name: string;
  iconUrl?: string | null;
  createdAt: string;
  config: WorkspaceConfig;
}

export interface WorkspaceResponseDTO {
  workspace: WorkspaceDTO;
}

export interface WorkspacesResponseDTO {
  workspaces: WorkspaceDTO[];
}
