import { useGetWorkspacesQuery } from "../store/workspace-api";
import { useCurrentWorkspace, useLocalWorkspaces } from "./use-workspace";
import { useWorkspaceManager } from "./use-workspace-manager";

export function useWorkspaceSwitcher() {
  const { isLoading, isFetching, isError } = useGetWorkspacesQuery();
  const localWorkspaces = useLocalWorkspaces();
  const currentWorkspace = useCurrentWorkspace();
  const { switchWorkspace } = useWorkspaceManager();

  return {
    isLoading,
    isFetching,
    isError,
    localWorkspaces,
    currentWorkspace,
    switchWorkspace,
  };
}
