export interface WorkspaceDTO {
  id: string;
  name: string;
  iconUrl?: string | null;
  createdAt: string;
  allNotesSortMode: "alphabetical" | "lastModified";
  favoriteIds: string[];
}

export interface WorkspaceResponseDTO {
  workspace: WorkspaceDTO;
}

export interface WorkspacesResponseDTO {
  workspaces: WorkspaceDTO[];
}
