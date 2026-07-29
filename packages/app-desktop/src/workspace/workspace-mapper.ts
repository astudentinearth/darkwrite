import type { WorkspaceConfig, WorkspaceDTO } from "@darkwrite/common";
import type { WorkspaceRow } from "@/db/schema";

export function workspaceToDto(workspace: WorkspaceRow): WorkspaceDTO {
  const { id, ownerId, name, config, iconUrl, createdAt } = workspace;
  const dto: WorkspaceDTO = {
    id,
    iconUrl,
    createdAt: createdAt.toISOString(),
    ...(ownerId ? { ownerId } : { ownerId: null }),
    config: config as WorkspaceConfig,
    name,
  };
  return dto;
}
