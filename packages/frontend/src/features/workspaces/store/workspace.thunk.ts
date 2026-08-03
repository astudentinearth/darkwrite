import type {
  CreateWorkspaceDTO,
  DeepPartial,
  Workspace,
} from "@darkwrite/common";
import _ from "lodash";
import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import { selectAllNoteIdsByWorkspaceIdUnfiltered } from "@/features/note/store/note-selectors";
import { notesSlice } from "@/features/note/store/note-slice";
import { appSessionSlice } from "@/features/session/session-slice";
import type { AppDispatch, AppGetState } from "@/features/store/types";
import { selectAllWorkspaces } from "./workspace-selectors";
import { workspaceSlice } from "./workspace-slice";

const act = workspaceSlice.actions;

export const reloadWorkspaces = () => (dispatch: AppDispatch) =>
  DarkwriteAPIClient.workspace
    .getAll()
    .andTee((data) => dispatch(act.setWorkspaces(data.workspaces)));

export const updateWorkspace =
  (id: string, diff: DeepPartial<Workspace>) => (dispatch: AppDispatch) =>
    DarkwriteAPIClient.workspace
      .update(id, diff)
      .map(() =>
        dispatch(
          workspaceSlice.actions.updateWorkspace({ ..._.cloneDeep(diff), id }),
        ),
      );

export const createWorkspace =
  (arg: CreateWorkspaceDTO) => async (dispatch: AppDispatch) =>
    await DarkwriteAPIClient.workspace
      .create(arg)
      .andTee((res) => dispatch(act.addWorkspace(res.workspace)));

export const getCurrentWorkspaceId = (getState: AppGetState) =>
  getState().session.workspaceId;

export const deleteWorkspace =
  (id: string) => (dispatch: AppDispatch, getState: AppGetState) =>
    DarkwriteAPIClient.workspace.delete(id).andThen(() => {
      dispatch(act.removeWorkspace(id));
      dispatch(
        notesSlice.actions.removeMany(
          selectAllNoteIdsByWorkspaceIdUnfiltered(getState(), id),
        ),
      );

      const anyOtherWorkspace = selectAllWorkspaces(getState()).find(
        (w) => w.id !== id,
      );

      if (!anyOtherWorkspace) {
        // It's harder to recover from this state. Let the init routine clean things up
        window.location.reload();
        return okAsync(undefined);
      }

      dispatch(appSessionSlice.actions.switchWorkspace(anyOtherWorkspace.id));
      return okAsync(undefined);
    });
