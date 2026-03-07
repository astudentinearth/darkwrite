import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { DeepPartial } from "@/common/ts-util";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

export type WorkspaceSlice = {
  workspaces: Record<string, WorkspaceDTO>;
};

export const WORKSPACE_SLICE_NAME = "workspace";

const initialState: WorkspaceSlice = {
  workspaces: {},
};

export type UpdateWorkspaceArg = DeepPartial<WorkspaceDTO> & { id: string };

export const workspaceSlice = createSlice({
  name: WORKSPACE_SLICE_NAME,
  initialState,
  reducers: {
    setWorkspaces(state, action: PayloadAction<WorkspaceDTO[]>) {
      const workspaces = action.payload.reduce(
        (acc, workspace) => {
          acc[workspace.id] = workspace;
          return acc;
        },
        {} as Record<string, WorkspaceDTO>,
      );
      state.workspaces = workspaces;
    },
    updateWorkspace(state, action: PayloadAction<UpdateWorkspaceArg>) {
      const workspace = action.payload;
      if (state.workspaces[workspace.id]) {
        _.merge(state.workspaces[workspace.id], workspace);
      }
    },
    addWorkspace(state, action: PayloadAction<WorkspaceDTO>) {
      const workspace = action.payload;
      state.workspaces[workspace.id] = workspace;
    },
  },
});
