import { type Note, stableSortByOrderKeyFn } from "@darkwrite/common";
import { createSelector } from "@reduxjs/toolkit/react";
import {
  selectAllNotesViewOpen,
  selectFavoritesViewOpen,
} from "@/features/session/session-selectors";
import type { RootState } from "@/features/store/types";
import {
  selectAllNotes,
  selectFavoriteIds,
  selectNoteIdsByParentId,
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
  type:
    | "item"
    | "favorite"
    | "favoriteHeading"
    | "allNotesHeading"
    | "spacer"
    | "createNew";
  expanded?: boolean;
};

/** Stable empty references so closed-view selectors don't churn memoization. */
const EMPTY_IDS: string[] = [];
const EMPTY_TREE: NoteTreeItem[] = [];

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

    const buckets: Record<string, Note[]> = {};
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
        notes.toSorted(stableSortByOrderKeyFn()).map((n) => n.id),
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
  // Ancestor ids on the current path; guards against parentId cycles.
  ancestors: Set<string> = new Set(),
): NoteTreeItem[] =>
  ids.flatMap((id) => {
    const item = { id, type, depth, expanded: expandedIds.has(id) };
    if (!expandedIds.has(id) || ancestors.has(id)) return [item];
    if (childrenOf(id).length === 0)
      return [
        item,
        {
          id: `createnew-${item.id}-${item.depth}-${item.type}`,
          type: "createNew",
          depth: depth + 1,
        },
      ];
    return [
      item,
      ...flattenNoteTree(
        childrenOf(id),
        childrenOf,
        expandedIds,
        type,
        depth + 1,
        new Set(ancestors).add(id),
      ),
    ];
  });

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
    if (!expandedChildren) return EMPTY_TREE;
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
        ? selectNoteIdsByParentId(state, state.session.workspaceId ?? "", null)
        : EMPTY_IDS,
    selectExpandedNotes,
  ],
  (expandedChildren, rootIds, expandedIds) => {
    if (!expandedChildren) return EMPTY_TREE;
    const childrenOf = (id: string) => expandedChildren[id] ?? [];
    const idSet = new Set(expandedIds);

    return flattenNoteTree(rootIds, childrenOf, idSet, "item");
  },
);

export const selectSidebarTree = createSelector(
  [
    selectFavoritesView,
    selectAllNotesView,
    selectAllNotesViewOpen,
    selectFavoritesViewOpen,
  ],
  (favorites, allNotes, allNotesOpen, favoritesOpen): NoteTreeItem[] => {
    return [
      {
        id: "favoriteHeading",
        type: "favoriteHeading",
        depth: 0,
        expanded: favoritesOpen,
      },
      ...favorites,
      { id: "spacer", type: "spacer", depth: 0 },
      {
        id: "allNotesHeading",
        type: "allNotesHeading",
        depth: 0,
        expanded: allNotesOpen,
      },
      ...allNotes,
    ];
  },
);
