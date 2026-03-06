import { DarkwriteAPIClient } from "@/api/api-client";
import { NotFoundError } from "@/common/error";
import { setWorkspaceId } from "@/context/local-state";
import { AppStore } from "@/features/store/redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const noteLoader = async ({
  params,
  store,
}: {
  params: any;
  store: AppStore;
}) => {
  const { pageId } = params;
  if (!pageId) throw new Error("Note id not found");

  const { note } = await DarkwriteAPIClient.note.getById(pageId);
  if (!note) throw new NotFoundError("Note", pageId);

  const workspaceId = store.getState().session.workspaceId;
  if (note.workspaceId && note.workspaceId !== workspaceId) {
    setWorkspaceId(note.workspaceId);
  }

  return { note };
};
