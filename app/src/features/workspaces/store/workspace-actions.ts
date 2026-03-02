import { workspaceApi } from "./workspace-api";
import { store } from "@/features/store/redux";
import { UpdateWorkspaceArg, workspaceSlice } from "./workspace-slice";
import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { CreateWorkspaceDTO } from "@/common/dto/request/workspace.request";

export async function fetchWorkspaces() {
  return store
    .dispatch(workspaceApi.endpoints.getWorkspaces.initiate())
    .unwrap();
}

export function updateWorkspace(arg: UpdateWorkspaceArg) {
  return store
    .dispatch(workspaceApi.endpoints.updateWorkspace.initiate(arg))
    .unwrap();
}

export function _putWorkspace(workspace: WorkspaceDTO) {
  store.dispatch(workspaceSlice.actions.addWorkspace(workspace));
}

export async function createWorkspace(dto: CreateWorkspaceDTO) {
  return store
    .dispatch(workspaceApi.endpoints.createWorkspace.initiate(dto))
    .unwrap();
}
