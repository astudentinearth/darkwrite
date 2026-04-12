import { Workspace } from "@/db/schema";
import { WorkspaceConfig, WorkspaceDTO } from "@darkwrite/common";

export function workspaceToDto(workspace: Workspace): WorkspaceDTO {
  const {id, ownerId, name, config, iconUrl, createdAt} = workspace;
  const dto: WorkspaceDTO = {
    id,
    icon_url: iconUrl,
    created_at: createdAt.toISOString(),
    ...(ownerId && {owner_id: ownerId}),
    config: config as WorkspaceConfig,
    name
  }
  return dto;
}

