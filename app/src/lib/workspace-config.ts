export type WorkspaceSyncMode = "cloud" | "offline";

export interface WorkspaceConfig {
  syncMode: WorkspaceSyncMode;
  defaultCodeLanguage: string;
}

export const getDefaultWorkspaceConfiguration = () =>
  ({
    syncMode: "offline",
    defaultCodeLanguage: "plaintext",
  }) satisfies WorkspaceConfig;