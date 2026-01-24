import { DarkwriteAPIClient } from "@/api/api-client";
import { setWorkspaceId } from "@/context/local-state";
import { store } from "@/features/store/redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const noteLoader = async ({ params }: { params: any }) => {
  const { pageId } = params;
  if (!pageId) throw new Error("Note id not found");

  const { note } = await DarkwriteAPIClient.note.getById(pageId);
  if (!note) throw new Error("Note not found");

  const workspaceId = store.getState().session.workspaceId;
  if (note.workspaceId && note.workspaceId !== workspaceId) {
    setWorkspaceId(note.workspaceId);
  }

  return { note };
};
