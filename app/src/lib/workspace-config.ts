import z from "zod";

export const WorkspaceSyncModeSchema = z.enum(["cloud", "offline"]);
export type WorkspaceSyncMode = z.infer<typeof WorkspaceSyncModeSchema>;

export const WorkspaceConfigSchema = z.object({
  syncMode: WorkspaceSyncModeSchema,
  defaultCodeLanguage: z.string(),
});

export type WorkspaceConfig = z.infer<typeof WorkspaceConfigSchema>;
export const getDefaultWorkspaceConfiguration = () =>
  ({
    syncMode: "offline",
    defaultCodeLanguage: "plaintext",
  }) satisfies WorkspaceConfig;
