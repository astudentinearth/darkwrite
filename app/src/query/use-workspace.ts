import { DarkwriteAPIClient } from "@/api/api-client";
import { UpdateWorkspaceDTO } from "@/common/dto/request/workspace.request";
import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { useLocalStore } from "@/context/local-state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";

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

export const useUpdateWorkspace = ()=>{
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (workspace: WorkspaceDTO)=>{
      const dto: UpdateWorkspaceDTO = _.cloneDeep(workspace);
      const id = workspace.id;
      await DarkwriteAPIClient.workspace.update(id, dto);
    },
    onSettled() {
       qc.invalidateQueries({queryKey: ["workspace"]}); 
    },
  });
  return mutation;
}

