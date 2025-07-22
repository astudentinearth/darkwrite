import { DarkwriteAPIClient } from "@/api/api-client";
import { useLocalStore } from "@/context/local-state";
import { useQuery } from "@tanstack/react-query";

export const useWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspace"],
    queryFn: async () => {
      const { workspaces } = await DarkwriteAPIClient.workspace.getAll();
      return workspaces;
    },
  });
};

export const useWorkspaceById = (id: string) => {
  const workspaces = useWorkspacesQuery().data;
  if(workspaces == null) return undefined;
  return workspaces.find(w => w.id === id);
};

export const useCurrentWorkspace = () => {
  const workspaceId = useLocalStore(s => s.workspaceId);
  const workspaces = useWorkspacesQuery().data;
  if(workspaces == null) return undefined;
  return workspaces.find(w => w.id === workspaceId);
}
