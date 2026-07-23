import type { NoteDTO } from "@darkwrite/common";
import { createSelector } from "@reduxjs/toolkit/react";
import {
  selectAllNotesViewOpen,
  selectFavoritesViewOpen,
} from "@/features/session/session-selectors";
import type { RootState } from "@/features/store/types";
import {
  selectAllNotes,
  selectFavoriteIds,
  selectNotesByParentId,
} from "./note-selectors";

export const selectMoveNoteDialogState = (state: RootState) =>
  state.noteUi.moveNoteDialog;

export const selectClearTrashDialogState = (state: RootState) =>
  state.noteUi.trashDialog;

export const selectExpandedNotes = (state: RootState) =>
  state.noteUi.sidebar.expandedNotes;

export const selectExpandedFavorites = (state: RootState) =>
  state.noteUi.sidebar.expandedFavorites;

export type NoteTreeItem = {
  id: string;
  depth: number;
  type: "item" | "favorite" | "favoriteHeading" | "allNotesHeading";
  expanded?: boolean;
};

const selectChildrenOfExpandedNotes = createSelector(
  [
    selectAllNotesViewOpen,
    selectExpandedNotes,
    selectExpandedFavorites,
    selectAllNotes,
    selectFavoritesViewOpen,
  ],
  (viewOpen, expanded, expandedFavorites, all, favoritesOpen) => {
    if (!viewOpen && !favoritesOpen) return {}; // short circuit out
    const expandedSet = new Set([...expanded, ...expandedFavorites]);

    const buckets: Record<string, NoteDTO[]> = {};
    for (const note of all) {
      const parentId = note.parentId;
      if (parentId && !note.isTrashed && expandedSet.has(parentId)) {
        buckets[parentId] ??= [];
        buckets[parentId].push(note);
      }
    }

    return Object.fromEntries(
      Object.entries(buckets).map(([parentId, notes]) => [
        parentId,
        notes
          .toSorted((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
          .map((n) => n.id),
      ]),
    );
  },
);

const flattenNoteTree = (
  ids: string[],
  childrenOf: (id: string) => string[],
  expandedIds: Set<string>,
  type: NoteTreeItem["type"] = "item",
  depth = 0,
): NoteTreeItem[] =>
  ids.flatMap((id) =>
    expandedIds.has(id)
      ? [
          { id, type, depth, expanded: expandedIds.has(id) },
          ...flattenNoteTree(
            childrenOf(id),
            childrenOf,
            expandedIds,
            type,
            depth + 1,
          ),
        ]
      : [{ id, type, depth, expanded: expandedIds.has(id) }],
  );

const selectFavoritesView = createSelector(
  [
    (state: RootState) =>
      selectFavoritesViewOpen(state)
        ? selectChildrenOfExpandedNotes(state)
        : null,
    (state: RootState) =>
      selectFavoriteIds(state, state.session.workspaceId ?? ""),
    selectExpandedFavorites,
  ],
  (expandedChildren, favoriteIds, expandedIds) => {
    if (!expandedChildren) return [];
    const childrenOf = (id: string) => expandedChildren[id] ?? [];
    const idSet = new Set(expandedIds);

    return flattenNoteTree(favoriteIds, childrenOf, idSet, "favorite");
  },
);

const selectAllNotesView = createSelector(
  [
    (state: RootState) =>
      selectAllNotesViewOpen(state)
        ? selectChildrenOfExpandedNotes(state)
        : null,
    (state: RootState) =>
      selectAllNotesViewOpen(state)
        ? selectNotesByParentId(state, state.session.workspaceId ?? "", null)
        : [],
    selectExpandedNotes,
  ],
  (expandedChildren, rootIds, expandedIds) => {
    if (!expandedChildren) return [];
    const childrenOf = (id: string) => expandedChildren[id] ?? [];
    const idSet = new Set(expandedIds);

    return flattenNoteTree(rootIds, childrenOf, idSet, "item");
  },
);

export const selectSidebarTree = createSelector(
  [selectFavoritesView, selectAllNotesView],
  (favorites, allNotes): NoteTreeItem[] => {
    return [
      { id: "favoriteHeading", type: "favoriteHeading", depth: 0 },
      ...favorites,
      { id: "allNotesHeading", type: "allNotesHeading", depth: 0 },
      ...allNotes,
    ];
  },
);
