import {
  type DwError,
  dwErr,
  dwErrAsync,
  type Note,
  type NotePartial,
  type ParentId,
  Rank,
} from "@darkwrite/common";
import { errAsync } from "neverthrow";
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

/**
 * Eagerly load all note metadata in a given workspace
 * @param workspaceId
 * @returns either the loaded notes or an error
 */
export const fetchNotesInWorkspace =
  (workspaceId: string) => (dispatch: AppDispatch) =>
    DarkwriteAPIClient.note
      .getAllByWorkspaceId(workspaceId)
      .andTee(({ notes }) => dispatch(act.upsertNotes(Object.values(notes))));

/**
 * Load all notes in the currently active workspace.
 * @returns either the loaded notes or an error
 */
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

/** Creates a new note with given parent ID.
 * No parent id, or null parent id, creates at the root.
 * @param navigateAfter optionally navigate to the new note once it's successfully created
 * */
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

/**
 * Recover from a failed note update by reloading the entire workspace.
 * @param error captured from the result chain
 * @param dispatch
 * @returns the original error
 */
const reconcileOnFailedUpdate = (error: DwError, dispatch: AppDispatch) => {
  dispatch(loadNotesInCurrentWorkspace());
  return errAsync(error);
};

/**
 * Patch the given set of notes.
 * @param patches a list of changes to apply
 * @returns the result of the update
 */
export const updateManyNotes =
  (patches: NotePartial[]) => (dispatch: AppDispatch) => {
    dispatch(act.updateMany(patches.map((p) => ({ id: p.id, changes: p }))));
    return DarkwriteAPIClient.note
      .patchAll(patches)
      .orElse((e) => reconcileOnFailedUpdate(e, dispatch));
  };

/**
 * Patch a single note. (delegates to {@link updateManyNotes})
 * @param patch changes to apply
 * @returns the result of the update
 */
export const updateNote = (patch: NotePartial) => updateManyNotes([patch]);
