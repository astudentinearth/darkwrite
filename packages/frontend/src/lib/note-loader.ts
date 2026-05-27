import { DarkwriteAPIClient } from "@/api/api-client";
import { appSessionSlice } from "@/features/session/session-slice";
import type { AppStore } from "@/features/store/types";

type NoteLoaderProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: { pageId?: string };
  store: AppStore;
};

export const noteLoader = async ({ params, store }: NoteLoaderProps) => {
  const { pageId } = params;
  if (!pageId) throw new Error("Note id not found");

  const result = await DarkwriteAPIClient.note.getById(pageId);
  if (result.isErr()) throw new Error(`Note ${pageId} not found.`);
  const note = result.value.note;
  if (!note) throw new Error(`Note ${pageId} not found.`);

  const workspaceId = store.getState().session.workspaceId;
  if (note.workspaceId && note.workspaceId !== workspaceId) {
    store.dispatch(appSessionSlice.actions.switchWorkspace(note.workspaceId));
  }

  return { note };
};
