import {
  dwErr,
  dwErrAsync,
  type Note,
  type ParentId,
  Rank,
} from "@darkwrite/common";
import { DarkwriteAPIClient } from "@/api/api-client";
import { navigateToNote } from "@/features/navigation/navigator";
import type { AppDispatch, AppGetState } from "@/features/store/types";
import { getCurrentWorkspaceId } from "@/features/workspaces/store/workspace.thunk";
import { selectNotesByParentId } from "./note-selectors";
import { notesSlice } from "./note-slice";

export interface CreateNoteArgs {
  parentId?: ParentId;
  navigateAfter?: boolean;
}

const act = notesSlice.actions;

export const fetchNotesInWorkspace =
  (workspaceId: string) => (dispatch: AppDispatch) =>
    DarkwriteAPIClient.note
      .getAllByWorkspaceId(workspaceId)
      .andTee(({ notes }) => dispatch(act.upsertNotes(Object.values(notes))));

export const loadNotesInCurrentWorkspace =
  () => (dispatch: AppDispatch, getState: AppGetState) => {
    const workspaceId = getCurrentWorkspaceId(getState);
    if (!workspaceId) return dwErr("Workspace not ready yet.");
    return dispatch(fetchNotesInWorkspace(workspaceId));
  };

/**
 * Derives the order key for a note appended to the end of its layer. The
 * result sorts strictly after every sibling; input order is not assumed.
 */
export const getCreationRank = (siblings: Note[]) => {
  if (siblings.length === 0) return Rank.default();

  // sort defensively
  const sorted = siblings.toSorted((a, b) =>
    Rank.sorter(a.orderHint, b.orderHint),
  );

  const last = sorted[sorted.length - 1];
  return new Rank(last.orderHint).next();
};

export const createNote =
  ({ parentId = null, navigateAfter }: CreateNoteArgs) =>
  (dispatch: AppDispatch, getState: AppGetState) => {
    const workspaceId = getCurrentWorkspaceId(getState);
    if (!workspaceId) return dwErrAsync("Workspace not ready yet.");

    const siblings = selectNotesByParentId(getState(), workspaceId, parentId);
    const now = new Date().toISOString();
    const note: Note = {
      id: crypto.randomUUID(),
      title: "",
      icon: null,
      parentId,
      workspaceId,
      orderHint: getCreationRank(siblings).get(),
      favoriteOrderHint: "",
      isFavorite: false,
      isTrashed: false,
      trashedAt: null,
      createdAt: now,
      modifiedAt: now,
    };

    dispatch(act.upsertNotes([note]));

    return DarkwriteAPIClient.note
      .create(note)
      .andTee(() => {
        if (navigateAfter) navigateToNote(note.id);
      })
      .orTee(() => dispatch(act.removeNote(note.id)));
  };
