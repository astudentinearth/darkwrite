import { useCurrentWorkspace, useLocalWorkspaces } from "./use-workspace";
import { useWorkspaceManager } from "./use-workspace-manager";

export function useWorkspaceSwitcher() {
  const localWorkspaces = useLocalWorkspaces();
  const currentWorkspace = useCurrentWorkspace();
  const { switchWorkspace } = useWorkspaceManager();

  return {
    localWorkspaces,
    currentWorkspace,
    switchWorkspace,
  };
}
