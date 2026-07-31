import {
  byUpdateTime,
  isDescendant,
  type Note,
  Rank,
  stableSortByOrderKeyFn,
} from "@darkwrite/common";
import { createSelector, weakMapMemoize } from "@reduxjs/toolkit";
import type { DragEvent } from "react";
import { extractNoteDragData } from "@/features/dnd/datatransfer";
import type { RootState } from "@/features/store/types";
import { notesAdapter } from "./notes-adapter";
import type { MoveNoteSearchArgs, SearchArgs } from "./types";

const selectNotesState = (store: RootState) => store["notes-slice"];
const adapterSelectors = notesAdapter.getSelectors(selectNotesState);

export const {
  selectAll: selectAllNotes,
  selectEntities: selectAllNotesAsMap,
} = adapterSelectors;

export const selectNoteById: (
  state: RootState,
  id: string,
) => Note | undefined = adapterSelectors.selectById;

export const selectNotesByParentId = createSelector(
  [
    selectAllNotes,
    (_state: RootState, workspaceId: string) => workspaceId,
    (_state: RootState, _workspaceId: string, parentId: string | null) =>
      parentId,
  ],
  (allNotes, workspaceId, parentId) => {
    return allNotes
      .filter(
        (note) =>
          note.workspaceId === workspaceId &&
          note.parentId === parentId &&
          !note.isTrashed,
      )
      .toSorted(stableSortByOrderKeyFn());
  },
);

export const selectNoteIdsByParentId = createSelector(
  [selectNotesByParentId],
  (notes) => notes.map((n) => n.id),
  { memoize: weakMapMemoize },
);

/** This selector returns any and all notes associated with given workspace. */
export const selectAllNoteIdsByWorkspaceIdUnfiltered = createSelector(
  [selectAllNotes, (_state: RootState, workspaceId: string) => workspaceId],
  (allNotes, workspaceId) =>
    allNotes.filter((n) => n.workspaceId === workspaceId).map((n) => n.id),
);

export const selectRecentNotes = createSelector(
  [selectAllNotes, (_state: RootState, workspaceId: string) => workspaceId],
  (allNotes, workspaceId) => {
    return allNotes
      .filter((n) => n.workspaceId === workspaceId && !n.isTrashed)
      .toSorted(byUpdateTime("desc"))
      .slice(0, 5);
  },
);

export const selectFavoriteIds = createSelector(
  [selectAllNotes, (_state: RootState, workspaceId: string) => workspaceId],
  (allNotes, workspaceId) => {
    return allNotes
      .filter(
        (n) => n.workspaceId === workspaceId && n.isFavorite && !n.isTrashed,
      )
      .toSorted(stableSortByOrderKeyFn("favoriteOrderHint"))
      .map((n) => n.id);
  },
);

export const selectFavorites = createSelector(
  [selectAllNotes, (_state: RootState, workspaceId: string) => workspaceId],
  (allNotes, workspaceId) => {
    return allNotes
      .filter(
        (n) => n.workspaceId === workspaceId && n.isFavorite && !n.isTrashed,
      )
      .toSorted((a, b) =>
        Rank.sorter(a.favoriteOrderHint, b.favoriteOrderHint),
      );
  },
);

export const selectParentIdTree = createSelector(
  [selectAllNotesAsMap, (_state: RootState, noteId: string) => noteId],
  (notesMap, noteId) => {
    const tree: string[] = [];
    const seen = new Set<string>();
    let currentNote = notesMap[noteId];

    while (currentNote?.parentId) {
      if (seen.has(currentNote.id)) break; // prevent circular reference
      tree.push(currentNote.parentId);
      seen.add(currentNote.id);
      currentNote = notesMap[currentNote.parentId];
    }

    return tree.reverse();
  },
);

export const selectByWorkspaceAndSearchTerm = createSelector(
  [selectAllNotes, (_state: RootState, args: SearchArgs) => args],
  (notes, args) => {
    const { workspaceId, query } = args;
    if (!workspaceId) return [];
    return notes
      .filter(
        (n) =>
          n.workspaceId === workspaceId &&
          (n.title ?? "").toLowerCase().includes(query.toLowerCase()) &&
          !n.isTrashed,
      )
      .toSorted((a, b) => Rank.sorter(a.orderHint, b.orderHint))
      .map((n) => n.id);
  },
);

export const selectNoteTitle = createSelector(
  [selectNoteById],
  (note) => note?.title,
);

export const selectNoteIcon = createSelector(
  [selectNoteById],
  (note) => note?.icon,
);

/** This selector is for the move note UI, where descendant notes and the note we are moving should be excluded from the search results.
 */
export const selectNotesToMoveInto = createSelector(
  [selectAllNotesAsMap, (_state: RootState, args: MoveNoteSearchArgs) => args],
  (notes, args) => {
    const { workspaceId, query, targetNoteId } = args;
    if (!workspaceId) return [];
    return Object.values(notes)
      .filter(
        (n) =>
          n.workspaceId === workspaceId &&
          n.id !== targetNoteId &&
          !isDescendant(n.id, targetNoteId, notes) &&
          n.title.toLowerCase().includes(query.toLowerCase()) &&
          !n.isTrashed,
      )
      .map((n) => n.id);
  },
);

export const selectNoteIdsInTrash = createSelector(
  [selectAllNotes, (_state: RootState, workspaceId: string) => workspaceId],
  (allNotes, workspaceId) =>
    allNotes
      .filter((n) => n.workspaceId === workspaceId && n.isTrashed)
      .map((n) => n.id),
);

export function getMovingNote(e: DragEvent<HTMLElement>, state: RootState) {
  const sourceId = extractNoteDragData(e)?.noteId;
  if (!sourceId) return;
  const movingNote = selectNoteById(state, sourceId);
  return movingNote ?? null;
}
