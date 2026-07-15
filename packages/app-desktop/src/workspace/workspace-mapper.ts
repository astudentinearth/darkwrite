import type { WorkspaceDTO } from "@darkwrite/common";
import type { Workspace } from "@/db/schema";

export function workspaceToDto(workspace: Workspace): WorkspaceDTO {
  const { id, name, iconUrl, createdAt, allNotesSortMode, favoriteIds } =
    workspace;
  const dto: WorkspaceDTO = {
    id,
    iconUrl,
    createdAt: createdAt.toISOString(),
    name,
    allNotesSortMode,
    favoriteIds: favoriteIds ?? [],
  };
  return dto;
}
