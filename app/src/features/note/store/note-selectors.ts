import { RootState } from "@/features/store/types";
import { notesAdapter } from "./notes-adapter";
import { createSelector } from "@reduxjs/toolkit";
import { Rank } from "@/common/rank";
import { byUpdateTime } from "@/common/note-filters";
import { MoveNoteSearchArgs, SearchArgs } from "./types";
import { isDescendant } from "@/common/note";

const selectNotesState = (store: RootState) => store["notes-slice"];

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectEntities: selectAllNotesAsMap,
} = notesAdapter.getSelectors(selectNotesState);

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
      .toSorted((a, b) => Rank.sorter(a.orderHint, b.orderHint))
      .map((n) => n.id);
  },
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
      .toSorted((a, b) => Rank.sorter(a.favoriteOrderHint, b.favoriteOrderHint))
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
    let currentNote = notesMap[noteId];

    while (currentNote && currentNote.parentId) {
      tree.push(currentNote.parentId);
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
          n.title.toLowerCase().includes(query.toLowerCase()) &&
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
