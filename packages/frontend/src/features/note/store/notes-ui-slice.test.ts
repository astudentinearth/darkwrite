import { describe, expect, it } from "vitest";
import {
  initialNotesUiState,
  type NotesUiState,
  notesUiSlice,
} from "./notes-ui-slice";

const { expandNote, collapseNote, expandFavorite, collapseFavorite } =
  notesUiSlice.actions;

/** Apply a sequence of actions to the slice reducer starting from initial. */
const reduce = (
  ...actions: ReturnType<
    | typeof expandNote
    | typeof collapseNote
    | typeof expandFavorite
    | typeof collapseFavorite
  >[]
): NotesUiState =>
  actions.reduce(
    (state, action) => notesUiSlice.reducer(state, action),
    initialNotesUiState,
  );

describe("notesUiSlice sidebar expansion", () => {
  it("starts with both expansion lists empty", () => {
    expect(initialNotesUiState.sidebar.expandedNotes).toEqual([]);
    expect(initialNotesUiState.sidebar.expandedFavorites).toEqual([]);
  });

  it("expandNote appends the id", () => {
    const state = reduce(expandNote("a"), expandNote("b"));
    expect(state.sidebar.expandedNotes).toEqual(["a", "b"]);
  });

  it("expandNote does not duplicate an already-expanded id", () => {
    const state = reduce(expandNote("a"), expandNote("a"));
    expect(state.sidebar.expandedNotes).toEqual(["a"]);
  });

  it("collapseNote removes the id", () => {
    const state = reduce(expandNote("a"), expandNote("b"), collapseNote("a"));
    expect(state.sidebar.expandedNotes).toEqual(["b"]);
  });

  it("collapseNote is a no-op for an id that isn't expanded", () => {
    const state = reduce(expandNote("a"), collapseNote("missing"));
    expect(state.sidebar.expandedNotes).toEqual(["a"]);
  });

  it("expandFavorite and collapseFavorite manage the favorites list", () => {
    const expanded = reduce(expandFavorite("f1"), expandFavorite("f1"));
    expect(expanded.sidebar.expandedFavorites).toEqual(["f1"]);

    const collapsed = notesUiSlice.reducer(expanded, collapseFavorite("f1"));
    expect(collapsed.sidebar.expandedFavorites).toEqual([]);
  });

  it("keeps note and favorite expansion state independent", () => {
    const state = reduce(expandNote("a"), expandFavorite("a"));
    expect(state.sidebar.expandedNotes).toEqual(["a"]);
    expect(state.sidebar.expandedFavorites).toEqual(["a"]);

    const afterCollapse = notesUiSlice.reducer(state, collapseNote("a"));
    expect(afterCollapse.sidebar.expandedNotes).toEqual([]);
    expect(afterCollapse.sidebar.expandedFavorites).toEqual(["a"]);
  });
});
