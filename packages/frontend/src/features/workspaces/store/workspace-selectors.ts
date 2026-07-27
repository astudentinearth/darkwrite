import type { WorkspaceDTO } from "@darkwrite/common";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState, Selector } from "@/features/store/types";

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

export const selectWorkspaceCount = createSelector(
  [selectAllWorkspaces],
  (workspaces) => workspaces.length,
);
