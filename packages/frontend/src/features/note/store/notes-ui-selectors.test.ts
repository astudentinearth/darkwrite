// @vitest-environment jsdom
import { type Note, Rank } from "@darkwrite/common";
import { describe, expect, it } from "vitest";
import { appSessionSlice } from "@/features/session/session-slice";
import { type AppStore, createAppStore } from "@/features/store/redux";
import { notesSlice } from "./note-slice";
import { type NoteTreeItem, selectSidebarTree } from "./notes-ui-selectors";
import { notesUiSlice } from "./notes-ui-slice";

const WORKSPACE_ID = "ws-1";

/** n ascending rank strings, each sorting strictly after the previous. */
const ascendingRanks = (n: number): string[] => {
  const out: string[] = [];
  let rank = Rank.default();
  for (let i = 0; i < n; i++) {
    out.push(rank.get());
    rank = rank.next();
  }
  return out;
};

const makeNote = (over: Partial<Note> & { id: string }): Note => ({
  title: "",
  icon: null,
  parentId: null,
  workspaceId: WORKSPACE_ID,
  orderHint: Rank.default().get(),
  favoriteOrderHint: "",
  isFavorite: false,
  isTrashed: false,
  trashedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  modifiedAt: "2026-01-01T00:00:00.000Z",
  properties: {},
  propertyOrder: [],
  ...over,
});

type Setup = {
  notes: Note[];
  allNotesOpen?: boolean;
  favoritesOpen?: boolean;
  expandedNotes?: string[];
  expandedFavorites?: string[];
};

const setup = (opts: Setup): AppStore => {
  const store = createAppStore();
  const { actions } = appSessionSlice;
  store.dispatch(actions.switchWorkspace(WORKSPACE_ID));
  store.dispatch(actions.setAllNotesViewOpen(opts.allNotesOpen ?? false));
  store.dispatch(actions.setFavoritesViewOpen(opts.favoritesOpen ?? false));
  store.dispatch(notesSlice.actions.upsertNotes(opts.notes));
  for (const id of opts.expandedNotes ?? [])
    store.dispatch(notesUiSlice.actions.expandNote(id));
  for (const id of opts.expandedFavorites ?? [])
    store.dispatch(notesUiSlice.actions.expandFavorite(id));
  return store;
};

/**
 * Split the flat tree into its two sections, dropping the heading rows and the
 * spacer that separates them.
 */
const sections = (tree: NoteTreeItem[]) => {
  const spacerIdx = tree.findIndex((t) => t.type === "spacer");
  const allStart = tree.findIndex((t) => t.type === "allNotesHeading");
  return {
    favorites: tree.slice(1, spacerIdx),
    allNotes: tree.slice(allStart + 1),
  };
};

const shape = (item: NoteTreeItem) => ({
  id: item.id,
  depth: item.depth,
  expanded: item.expanded,
});

describe("selectSidebarTree", () => {
  it("renders only the two headings when both views are closed", () => {
    const store = setup({
      notes: [makeNote({ id: "r1" }), makeNote({ id: "r2" })],
      allNotesOpen: false,
      favoritesOpen: false,
    });

    expect(selectSidebarTree(store.getState())).toEqual([
      {
        id: "favoriteHeading",
        type: "favoriteHeading",
        depth: 0,
        expanded: false,
      },
      { id: "spacer", type: "spacer", depth: 0 },
      {
        id: "allNotesHeading",
        type: "allNotesHeading",
        depth: 0,
        expanded: false,
      },
    ]);
  });

  it("emits a createNew placeholder under an expanded childless parent", () => {
    const store = setup({
      notes: [makeNote({ id: "p" })],
      allNotesOpen: true,
      expandedNotes: ["p"],
    });

    const { allNotes } = sections(selectSidebarTree(store.getState()));
    expect(
      allNotes.map((t) => ({ id: t.id, type: t.type, depth: t.depth })),
    ).toEqual([
      { id: "p", type: "item", depth: 0 },
      { id: "createnew-p-0-item", type: "createNew", depth: 1 },
    ]);
  });

  it("lists root notes by orderHint and excludes trashed ones", () => {
    const [r0, r1, r2] = ascendingRanks(3);
    const store = setup({
      // deliberately inserted out of order
      notes: [
        makeNote({ id: "b", orderHint: r1 }),
        makeNote({ id: "c", orderHint: r2, isTrashed: true }),
        makeNote({ id: "a", orderHint: r0 }),
      ],
      allNotesOpen: true,
    });

    const { favorites, allNotes } = sections(
      selectSidebarTree(store.getState()),
    );
    expect(favorites).toEqual([]);
    expect(allNotes.map(shape)).toEqual([
      { id: "a", depth: 0, expanded: false },
      { id: "b", depth: 0, expanded: false },
    ]);
  });

  it("descends into expanded parents and nests children by depth", () => {
    const store = setup({
      notes: [
        makeNote({ id: "p" }),
        makeNote({ id: "q" }),
        makeNote({ id: "c", parentId: "p" }),
      ],
      allNotesOpen: true,
      expandedNotes: ["p"],
    });

    const { allNotes } = sections(selectSidebarTree(store.getState()));
    expect(allNotes.map(shape)).toEqual([
      { id: "p", depth: 0, expanded: true },
      { id: "c", depth: 1, expanded: false },
      { id: "q", depth: 0, expanded: false },
    ]);
  });

  it("sorts expanded children by orderHint rather than modifiedAt", () => {
    const [r0, r1, r2] = ascendingRanks(3);
    const store = setup({
      notes: [
        makeNote({ id: "p" }),
        // modifiedAt is the reverse of orderHint order
        makeNote({
          id: "c1",
          parentId: "p",
          orderHint: r0,
          modifiedAt: "2026-01-01T00:00:00.000Z",
        }),
        makeNote({
          id: "c2",
          parentId: "p",
          orderHint: r1,
          modifiedAt: "2026-02-01T00:00:00.000Z",
        }),
        makeNote({
          id: "c3",
          parentId: "p",
          orderHint: r2,
          modifiedAt: "2026-03-01T00:00:00.000Z",
        }),
      ],
      allNotesOpen: true,
      expandedNotes: ["p"],
    });

    const { allNotes } = sections(selectSidebarTree(store.getState()));
    expect(allNotes.filter((t) => t.depth === 1).map((t) => t.id)).toEqual([
      "c1",
      "c2",
      "c3",
    ]);
  });

  it("lists favorites by favoriteOrderHint with the favorite type", () => {
    const [f0, f1] = ascendingRanks(2);
    const store = setup({
      notes: [
        makeNote({ id: "f2", isFavorite: true, favoriteOrderHint: f1 }),
        makeNote({ id: "f1", isFavorite: true, favoriteOrderHint: f0 }),
        makeNote({ id: "plain" }),
      ],
      favoritesOpen: true,
    });

    const { favorites, allNotes } = sections(
      selectSidebarTree(store.getState()),
    );
    expect(allNotes).toEqual([]);
    expect(favorites.map((t) => ({ id: t.id, type: t.type }))).toEqual([
      { id: "f1", type: "favorite" },
      { id: "f2", type: "favorite" },
    ]);
  });

  it("expands a note in the all-notes view without expanding it as a favorite", () => {
    const store = setup({
      notes: [
        makeNote({ id: "x", isFavorite: true, favoriteOrderHint: "a" }),
        makeNote({ id: "cx", parentId: "x" }),
      ],
      allNotesOpen: true,
      favoritesOpen: true,
      expandedNotes: ["x"],
      expandedFavorites: [],
    });

    const { favorites, allNotes } = sections(
      selectSidebarTree(store.getState()),
    );
    // favorites view uses its own expansion set, so no child appears there
    expect(favorites.map(shape)).toEqual([
      { id: "x", depth: 0, expanded: false },
    ]);
    // all-notes view is expanded, so the child is nested
    expect(allNotes.map(shape)).toEqual([
      { id: "x", depth: 0, expanded: true },
      { id: "cx", depth: 1, expanded: false },
    ]);
  });

  it("excludes trashed notes from expanded children", () => {
    const store = setup({
      notes: [
        makeNote({ id: "p" }),
        makeNote({ id: "c1", parentId: "p" }),
        makeNote({ id: "c2", parentId: "p", isTrashed: true }),
      ],
      allNotesOpen: true,
      expandedNotes: ["p"],
    });

    const { allNotes } = sections(selectSidebarTree(store.getState()));
    expect(allNotes.map((t) => t.id)).toEqual(["p", "c1"]);
  });

  it("does not infinitely recurse on a parent cycle", () => {
    // Self-referential parent: only reachable because favorites are rooted by
    // favorite id, not by parentId === null.
    const store = setup({
      notes: [
        makeNote({
          id: "a",
          parentId: "a",
          isFavorite: true,
          favoriteOrderHint: "a",
        }),
      ],
      favoritesOpen: true,
      expandedFavorites: ["a"],
    });

    const { favorites } = sections(selectSidebarTree(store.getState()));
    // the ancestor guard stops descent after emitting the node once more
    expect(favorites.map(shape)).toEqual([
      { id: "a", depth: 0, expanded: true },
      { id: "a", depth: 1, expanded: true },
    ]);
  });
});
