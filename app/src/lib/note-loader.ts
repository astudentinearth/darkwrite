import { DarkwriteAPIClient } from "@/api/api-client";
import { setWorkspaceId, useLocalStore } from "@/context/local-state";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const noteLoader = async ({ params }: { params: any }) => {
  const { pageId } = params;
  if (!pageId) throw new Error("Note id not found");

  const { note } = await DarkwriteAPIClient.note.getById(pageId);
  if (!note) throw new Error("Note not found");

  const workspaceId = useLocalStore.getState().workspaceId;
  if (note.workspaceId && note.workspaceId !== workspaceId) {
    console.log("CORRECTING WORKSPACE ID");
    setWorkspaceId(note.workspaceId);
  }

  return { note };
};
