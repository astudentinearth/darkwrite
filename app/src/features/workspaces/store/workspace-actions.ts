import { CreateWorkspaceDTO } from "@/common/dto/request/workspace.request";
import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { AppStore } from "@/features/store/redux";
import { workspaceApi } from "./workspace-api";
import { UpdateWorkspaceArg, workspaceSlice } from "./workspace-slice";
import { useAppStore } from "@/features/store/hooks";
import { useMemo } from "react";

export function getWorkspaceActions(store: AppStore) {
  async function fetchWorkspaces() {
    return store
      .dispatch(workspaceApi.endpoints.getWorkspaces.initiate())
      .unwrap();
  }

  function updateWorkspace(arg: UpdateWorkspaceArg) {
    return store
      .dispatch(workspaceApi.endpoints.updateWorkspace.initiate(arg))
      .unwrap();
  }

  function _putWorkspace(workspace: WorkspaceDTO) {
    store.dispatch(workspaceSlice.actions.addWorkspace(workspace));
  }

  async function createWorkspace(dto: CreateWorkspaceDTO) {
    return store
      .dispatch(workspaceApi.endpoints.createWorkspace.initiate(dto))
      .unwrap();
  }

  function getCurrentWorkspaceId() {
    return store.getState().session.workspaceId;
  }

  return {
    fetchWorkspaces,
    updateWorkspace,
    _putWorkspace,
    createWorkspace,
    getCurrentWorkspaceId,
  };
}

export function useWorkspaceActions() {
  const store = useAppStore();
  const actions = useMemo(() => getWorkspaceActions(store), [store]);
  return actions;
}
