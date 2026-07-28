import { fetchNotesInWorkspace } from "../note/store/note.thunk";
import type { AppDispatch } from "../store/types";
import { appSessionSlice } from "./session-slice";

export const switchWorkspace =
  (workspaceId: string) => (dispatch: AppDispatch) => {
    dispatch(appSessionSlice.actions.switchWorkspace(workspaceId));
    dispatch(fetchNotesInWorkspace(workspaceId)).andTee((err) =>
      console.log(err),
    );
  };
