import { DarkwriteAPIClient } from "@/api/api-client";
import { NotFoundError } from "@darkwrite/common";
import { appSessionSlice } from "@/features/session/session-slice";
import { AppStore } from "@/features/store/types";

type NoteLoaderProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  store: AppStore;
};

export const noteLoader = async ({ params, store }: NoteLoaderProps) => {
  const { pageId } = params;
  if (!pageId) throw new Error("Note id not found");

  const { note } = await DarkwriteAPIClient.note.getById(pageId);
  if (!note) throw new NotFoundError("Note", pageId);

  const workspaceId = store.getState().session.workspaceId;
  if (note.workspaceId && note.workspaceId !== workspaceId) {
    store.dispatch(appSessionSlice.actions.switchWorkspace(note.workspaceId));
  }

  return { note };
};
