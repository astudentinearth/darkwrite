import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { RootState, Selector } from "@/features/store/types";
import { createSelector } from "@reduxjs/toolkit";

export const selectAllWorkspaces = createSelector(
  [(store: RootState) => Object.values(store.workspace.workspaces)],
  (workspaces) => workspaces,
);

export const selectWorkspaceById: Selector<string, WorkspaceDTO | undefined> = (
  store: RootState,
  id: string,
) => store.workspace.workspaces[id];

export const selectCurrentWorkspace = createSelector(
  [
    (state: RootState) => state.session.workspaceId ?? "",
    (state: RootState) => state.workspace.workspaces,
  ],
  (workspaceId, workspaces): WorkspaceDTO | undefined =>
    workspaces[workspaceId],
);

export const selectLocalWorkspaces = createSelector(
  [selectAllWorkspaces],
  (workspaces) => workspaces.filter((w) => w.config.syncMode === "offline"),
);
