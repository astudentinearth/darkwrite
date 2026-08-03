import type { WorkspaceConfig } from "@/workspace-config";

export interface Workspace {
  id: string;
  name: string;
  iconUrl?: string | null;
  createdAt: string;
  config: WorkspaceConfig;
}

/** @deprecated use `Workspace` instead */
export type WorkspaceDTO = Workspace;

export interface WorkspaceResponseDTO {
  workspace: Workspace;
}

export interface WorkspacesResponseDTO {
  workspaces: Workspace[];
}
