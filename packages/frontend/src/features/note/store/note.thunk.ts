import {
  type DwError,
  dwErr,
  dwErrAsync,
  isDescendant,
  type Note,
  type NotePartial,
  type ParentId,
  Rank,
  rebalanceLayer,
  stableSortByOrderKeyFn,
} from "@darkwrite/common";
import { errAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import { navigateToNote } from "@/features/navigation/navigator";
import type { AppDispatch, AppGetState } from "@/features/store/types";
import { getCurrentWorkspaceId } from "@/features/workspaces/store/workspace.thunk";
import {
  selectAllNotesAsMap,
  selectFavorites,
  selectNoteById,
  selectNotesByParentId,
} from "./note-selectors";
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

/**
 * Moves a note to the start or end of a tree layer.
 * @param sourceId the note we are moving
 * @param destinationId the new parent id
 * @param placement start or end
 * @returns nothing on success, error on failure
 */
export const moveNote =
  (
    sourceId: string,
    destinationId: ParentId,
    placement: "start" | "end" = "end",
  ) =>
  (dispatch: AppDispatch, getState: AppGetState) => {
    const sourceNote = selectNoteById(getState(), sourceId);
    if (!sourceNote) return dwErrAsync(`Note ${sourceId} does not exist.`);

    // block moving a note into itself or one of its descendants
    if (
      destinationId !== null &&
      isDescendant(destinationId, sourceId, selectAllNotesAsMap(getState()))
    )
      return dwErrAsync("Cannot move a note into its own subtree.");

    const layer = selectNotesByParentId(
      getState(),
      sourceNote.workspaceId,
      destinationId,
    )
      .toSorted(stableSortByOrderKeyFn())
      .filter((n) => n.id !== sourceId);

    const last =
      layer.length > 0
        ? layer[placement === "start" ? 0 : layer.length - 1]
        : null;
    const order = last ? Rank.safe(last.orderHint) : Rank.default();

    return dispatch(
      updateNote({
        id: sourceId,
        parentId: destinationId,
        orderHint:
          placement === "start" ? order.prev().get() : order.next().get(),
      }),
    );
  };

export type RelativePlacement = "above" | "below";

/**
 * Reorders a note in the tree.
 * @param sourceId the note we are moving
 * @param anchorId the note we are moving relative to
 * @param placement side of the anchor note we should place it against
 * @returns nothing on success, error on failure
 */
export const reorderNote =
  (sourceId: string, anchorId: string, placement: RelativePlacement) =>
  (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();

    const sourceNote = selectNoteById(state, sourceId);
    if (!sourceNote) return dwErrAsync("Source note does not exist.");

    const anchorNote = selectNoteById(state, anchorId);
    if (!anchorNote) return dwErrAsync("Neighboring note does not exist.");

    // the source adopts the anchor's parent; block if that parent is the
    // source itself or one of its descendants (would create a cycle)
    if (
      anchorNote.parentId !== null &&
      isDescendant(anchorNote.parentId, sourceId, selectAllNotesAsMap(state))
    )
      return dwErrAsync("Cannot move a note into its own subtree.");

    const siblings = selectNotesByParentId(
      state,
      anchorNote.workspaceId,
      anchorNote.parentId,
    )
      .toSorted(stableSortByOrderKeyFn())
      .filter((n) => n.id !== sourceId);

    const anchorIdx = siblings.findIndex((n) => n.id === anchorId);
    if (anchorIdx === -1) return dwErrAsync("Neighboring note does not exist.");

    const otherNeighborIdx = anchorIdx + (placement === "above" ? -1 : 1);

    const otherNeighbor =
      otherNeighborIdx < 0 || otherNeighborIdx >= siblings.length
        ? null
        : siblings[otherNeighborIdx];

    // no midpoint, equivalent to moving to list bounds. delegate to other handler
    if (!otherNeighbor)
      return dispatch(
        moveNote(
          sourceId,
          anchorNote.parentId,
          placement === "above" ? "start" : "end",
        ),
      );

    // collision/corrupt case
    if (
      otherNeighbor.orderHint === anchorNote.orderHint ||
      !Rank.isValid(otherNeighbor.orderHint) ||
      !Rank.isValid(anchorNote.orderHint)
    ) {
      const rebalanced = rebalanceLayer(siblings);

      // access by position directly, sort is stable
      const anchorOrder = rebalanced[anchorIdx].orderHint;
      const neighborOrder = rebalanced[otherNeighborIdx].orderHint;

      // no need for additional validation
      const result = Rank.midpoint(
        new Rank(anchorOrder),
        new Rank(neighborOrder),
      );
      if (result.collided)
        return dwErrAsync(
          "Layer reconciliation is broken: please report this issue.",
        );

      return dispatch(
        updateManyNotes([
          ...rebalanced,
          {
            id: sourceId,
            parentId: anchorNote.parentId,
            orderHint: result.midpoint.get(),
          },
        ]),
      );
    }

    // no problems beyond this point
    const newOrder = Rank.midpoint(
      new Rank(anchorNote.orderHint),
      new Rank(otherNeighbor.orderHint),
    );

    if (newOrder.collided)
      return dwErrAsync("Note reordering is broken: please report this issue.");

    return dispatch(
      updateNote({
        id: sourceId,
        parentId: anchorNote.parentId,
        orderHint: newOrder.midpoint.get(),
      }),
    );
  };

const addFavoriteToEnd =
  (noteId: string) => (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const note = selectNoteById(state, noteId);
    if (!note) return dwErrAsync("Note does not exist.");

    const favorites = selectFavorites(state, note.workspaceId).filter(
      (n) => n.id !== noteId,
    );

    if (favorites.length === 0)
      return dispatch(
        updateNote({
          id: noteId,
          favoriteOrderHint: Rank.default().get(),
          isFavorite: true,
        }),
      );

    const last = favorites[favorites.length - 1];

    return dispatch(
      updateNote({
        id: noteId,
        isFavorite: true,
        favoriteOrderHint: Rank.safe(last.favoriteOrderHint).next().get(),
      }),
    );
  };

export const reorderFavorite =
  (
    noteId: string,
    anchorNoteId?: string,
    placement: RelativePlacement = "below",
  ) =>
  (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const note = selectNoteById(state, noteId);
    if (!note) return dwErrAsync("Note does not exist.");

    const favorites = selectFavorites(state, note.workspaceId).filter(
      (n) => n.id !== noteId,
    );

    if (!anchorNoteId) return dispatch(addFavoriteToEnd(noteId));

    const anchor = selectNoteById(state, anchorNoteId);
    if (!anchor) return dwErrAsync("Anchor note does not exist.");

    const neighborIdx =
      favorites.findIndex((n) => n.id === anchorNoteId) +
      (placement === "below" ? 1 : -1);

    if (neighborIdx >= favorites.length)
      return dispatch(addFavoriteToEnd(noteId));

    if (neighborIdx < 0) {
      const rank = Rank.safe(anchor.favoriteOrderHint);
      return dispatch(
        updateNote({
          id: noteId,
          isFavorite: true,
          favoriteOrderHint: rank.prev().get(),
        }),
      );
    }

    const neighbor = favorites[neighborIdx];

    // collision case
    if (
      !Rank.isValid(neighbor.favoriteOrderHint) ||
      !Rank.isValid(anchor.favoriteOrderHint) ||
      anchor.favoriteOrderHint === neighbor.favoriteOrderHint
    ) {
      const rebalanced = rebalanceLayer(favorites, "favoriteOrderHint");
      const anchorIdx = favorites.findIndex((n) => n.id === anchorNoteId);
      const rank = Rank.midpoint(
        new Rank(rebalanced[anchorIdx].favoriteOrderHint),
        new Rank(rebalanced[neighborIdx].favoriteOrderHint),
      );

      if (rank.collided)
        return dwErrAsync(
          "Favorites reconciliation is broken: please report this issue.",
        );

      return dispatch(
        updateManyNotes([
          ...rebalanced,
          {
            id: noteId,
            isFavorite: true,
            favoriteOrderHint: rank.midpoint.get(),
          },
        ]),
      );
    }

    const midpoint = Rank.midpoint(
      new Rank(neighbor.favoriteOrderHint),
      new Rank(anchor.favoriteOrderHint),
    );
    if (midpoint.collided)
      return dwErrAsync(
        "Favorite reordering is broken: please report this issue.",
      );

    return dispatch(
      updateNote({
        id: noteId,
        favoriteOrderHint: midpoint.midpoint.get(),
        isFavorite: true,
      }),
    );
  };

export const unfavorite = (noteId: string) => (dispatch: AppDispatch) =>
  dispatch(updateNote({ id: noteId, isFavorite: false }));
