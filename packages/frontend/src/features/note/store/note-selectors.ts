import { byUpdateTime, isDescendant, NoteType } from "@darkwrite/common";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/features/store/types";
import { notesAdapter } from "./notes-adapter";
import type { MoveNoteSearchArgs, SearchArgs } from "./types";

const selectNotesState = (store: RootState) => store["notes-slice"];

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectEntities: selectAllNotesAsMap,
} = notesAdapter.getSelectors(selectNotesState);

/** Select notes in a layer sorted descending by their modification date */
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
      .toSorted((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
      .map((n) => n.id);
  },
);

export const selectNotesByParentIdAlphabetical = createSelector(
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
      .toSorted((a, b) => a.title.localeCompare(b.title))
      .map((n) => n.id);
  },
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
  [
    (state: RootState) => state.workspace.workspaces,
    (_state: RootState, workspaceId: string) => workspaceId,
  ],
  (workspaces, workspaceId) => workspaces[workspaceId]?.favoriteIds ?? [],
);

export const selectFavorites = createSelector(
  [
    selectAllNotes,
    (state: RootState) => state.workspace.workspaces,
    (_state: RootState, workspaceId: string) => workspaceId,
  ],
  (allNotes, workspaces, workspaceId) => {
    const ids = workspaces[workspaceId]?.favoriteIds ?? [];
    return ids
      .map((id) => allNotes.find((n) => n.id === id))
      .filter((n): n is NonNullable<typeof n> => n !== undefined);
  },
);

export const selectIsFavorite = createSelector(
  [
    (state: RootState) => state.workspace.workspaces,
    (_state: RootState, workspaceId: string) => workspaceId,
    (_state: RootState, _workspaceId: string, noteId: string) => noteId,
  ],
  (workspaces, workspaceId, noteId) => {
    const ids = workspaces[workspaceId]?.favoriteIds ?? [];
    return ids.includes(noteId);
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
      .toSorted((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
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

/** Selects IDs of Doc-type notes that are direct children of the given database. */
export const selectNotesInDatabase = createSelector(
  [selectAllNotes, (_state: RootState, parentId: string) => parentId],
  (allNotes, parentId) =>
    allNotes
      .filter(
        (n) =>
          n.parentId === parentId && n.type === NoteType.Doc && !n.isTrashed,
      )
      .toSorted((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
      .map((n) => n.id),
);

/** Selects IDs of DatabaseView-type notes that are direct children of the given database. */
export const selectViewsOfDatabase = createSelector(
  [selectAllNotes, (_state: RootState, parentId: string) => parentId],
  (allNotes, parentId) =>
    allNotes
      .filter(
        (n) =>
          n.parentId === parentId &&
          n.type === NoteType.DatabaseView &&
          !n.isTrashed,
      )
      .toSorted((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
      .map((n) => n.id),
);

/** Selects IDs of Database-type notes in the given workspace that are not trashed. */
export const selectDatabasesInWorkspace = createSelector(
  [selectAllNotes, (_state: RootState, workspaceId: string) => workspaceId],
  (allNotes, workspaceId) =>
    allNotes
      .filter(
        (n) =>
          n.workspaceId === workspaceId &&
          n.type === NoteType.Database &&
          !n.isTrashed,
      )
      .map((n) => n.id),
);
