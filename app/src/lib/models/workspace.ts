export type WorkspaceSyncMode = "cloud" | "offline";

export interface WorkspaceConfig {
  syncMode: WorkspaceSyncMode;
  defaultCodeLanguage: string;
}

export interface Workspace {
  id: string;
  owner_id?: string;
  name: string;
  icon_url?: string;
  created_at: Date;
  config: WorkspaceConfig;
}

export const getDefaultWorkspaceConfiguration = () =>
  ({
    syncMode: "offline",
    defaultCodeLanguage: "plaintext",
  }) satisfies WorkspaceConfig;

