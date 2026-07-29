import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const NOTES_API_REDUCER_PATH = "notes-api";
export const NOTES_TAG_TYPE = "Note";

export function noteByWorkspaceIdTag(workspaceId: string) {
  return `WORKSPACE_${workspaceId}`;
}

export function favoriteByWorkspaceIdTag(workspaceId: string) {
  return `WORKSPACE_${workspaceId}_FAVORITES`;
}

export function noteByParentIdTag(
  workspaceId: string,
  parentId: string | null,
) {
  return `WORKSPACE_${workspaceId}_PARENT_${parentId ?? "ROOT"}`;
}

export function recentsByWorkspaceIdTag(workspaceId: string) {
  return `WORKSPACE_${workspaceId}_RECENTS`;
}

export function parentTreeTag(noteId: string) {
  return `PARENT_TREE_${noteId}`;
}

export function noteByIdTag(noteId: string) {
  return `NOTE_${noteId}`;
}

export const notesApi = createApi({
  reducerPath: NOTES_API_REDUCER_PATH,
  baseQuery: fakeBaseQuery(),
  tagTypes: [NOTES_TAG_TYPE],
  endpoints: () => ({}),
});
