import { Workspace } from "@/db/schema";
import { WorkspaceConfig, WorkspaceDTO } from "@darkwrite/common";

export function workspaceToDto(workspace: Workspace): WorkspaceDTO {
  const { id, ownerId, name, config, iconUrl, createdAt } = workspace;
  const dto: WorkspaceDTO = {
    id,
    iconUrl,
    createdAt: createdAt.toISOString(),
    ...(ownerId && { ownerId }),
    config: config as WorkspaceConfig,
    name,
  };
  return dto;
}
