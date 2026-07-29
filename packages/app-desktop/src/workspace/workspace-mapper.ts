import type { Workspace, WorkspaceConfig } from "@darkwrite/common";
import type { WorkspaceRow } from "@/db/schema";

export function workspaceToDto(workspace: WorkspaceRow): Workspace {
  const { id, name, config, iconUrl, createdAt } = workspace;
  const dto: Workspace = {
    id,
    iconUrl,
    createdAt: createdAt.toISOString(),
    config: config as WorkspaceConfig,
    name,
  };
  return dto;
}
