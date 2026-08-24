// @vitest-environment jsdom
import {
  dwErrAsync,
  getDefaultNoteCustomization,
  type Note,
  type NoteContent,
  type NotePropertyMap,
  PropertyType,
  Rank,
} from "@darkwrite/common";
import { nanoid } from "nanoid";
import { okAsync } from "neverthrow";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DarkwriteAPIClient } from "@/api/api-client";
import { editorSlice } from "@/features/editor/store/editor-slice";
import { NavigationEventBus } from "@/features/navigation/navigator";
import { appSessionSlice } from "@/features/session/session-slice";
import { type AppStore, createAppStore } from "@/features/store/redux";
import {
  clearTrash,
  createNote,
  duplicateNote,
  getCreationRank,
  moveNote,
  moveToTrash,
  permanentlyDeleteNote,
  reorderFavorite,
  reorderNote,
  restoreFromTrash,
  unfavorite,
  updateManyNotes,
  updateNote,
} from "./note.thunk";
import {
  selectFavorites,
  selectNoteById,
  selectNoteIdsInTrash,
  selectNotesByParentId,
} from "./note-selectors";
import { notesSlice } from "./note-slice";

vi.mock("@/api/api-client", () => ({
  DarkwriteAPIClient: {
    note: {
      create: vi.fn(),
      patchAll: vi.fn(),
      getAllByWorkspaceId: vi.fn(),
      delete: vi.fn(),
      clearTrash: vi.fn(),
      getDocument: vi.fn(),
      setDocument: vi.fn(),
    },
  },
}));

const WORKSPACE_ID = "ws-1";
const createMock = vi.mocked(DarkwriteAPIClient.note.create);
const patchMock = vi.mocked(DarkwriteAPIClient.note.patchAll);
const getAllMock = vi.mocked(DarkwriteAPIClient.note.getAllByWorkspaceId);
const deleteMock = vi.mocked(DarkwriteAPIClient.note.delete);
const clearTrashMock = vi.mocked(DarkwriteAPIClient.note.clearTrash);
const getDocumentMock = vi.mocked(DarkwriteAPIClient.note.getDocument);
const setDocumentMock = vi.mocked(DarkwriteAPIClient.note.setDocument);

const makeNote = (over: Partial<Note> = {}): Note => ({
  id: crypto.randomUUID(),
  title: "",
  icon: null,
  parentId: null,
  workspaceId: WORKSPACE_ID,
  orderHint: Rank.default().get(),
  favoriteOrderHint: "",
  isFavorite: false,
  isTrashed: false,
  trashedAt: null,
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  properties: {},
  ...over,
});

const makeContent = (over: Partial<NoteContent> = {}): NoteContent => ({
  contents: { type: "doc", content: [] },
  customizations: getDefaultNoteCustomization(),
  ...over,
});

describe("getCreationRank", () => {
  it("returns the default rank for an empty layer", () => {
    expect(getCreationRank([]).get()).toBe(Rank.default().get());
  });

  it("returns a rank that sorts strictly after a single sibling", () => {
    const sibling = makeNote({ orderHint: Rank.default().get() });
    const rank = getCreationRank([sibling]);

    expect(rank.get()).toBe(new Rank(sibling.orderHint).next().get());
    expect(Rank.sorter(rank.get(), sibling.orderHint)).toBeGreaterThan(0);
  });

  it("appends after the greatest sibling regardless of input order", () => {
    const r1 = Rank.default().get();
    const r2 = new Rank(r1).next().get();
    const r3 = new Rank(r2).next().get();
    // deliberately unsorted
    const siblings = [
      makeNote({ orderHint: r3 }),
      makeNote({ orderHint: r1 }),
      makeNote({ orderHint: r2 }),
    ];

    const rank = getCreationRank(siblings);

    expect(rank.get()).toBe(new Rank(r3).next().get());
    for (const sibling of siblings) {
      expect(Rank.sorter(rank.get(), sibling.orderHint)).toBeGreaterThan(0);
    }
  });
});

describe("createNote", () => {
  let store: AppStore;

  const selectWorkspace = () =>
    store.dispatch(appSessionSlice.actions.switchWorkspace(WORKSPACE_ID));

  beforeEach(() => {
    // the session listener persists workspaceId to localStorage; clear it so
    // each store starts from a known-empty session
    localStorage.clear();
    createMock.mockReset();
    createMock.mockReturnValue(okAsync(undefined));
    store = createAppStore();
  });

  it("optimistically inserts a note into the current workspace layer", async () => {
    selectWorkspace();
    await store.dispatch(createNote({ parentId: null }));

    const layer = selectNotesByParentId(store.getState(), WORKSPACE_ID, null);
    expect(layer).toHaveLength(1);
    expect(layer[0]).toMatchObject({
      title: "",
      parentId: null,
      workspaceId: WORKSPACE_ID,
      orderHint: Rank.default().get(),
    });

    expect(createMock).toHaveBeenCalledTimes(1);
    // the exact note that landed in the store is what gets persisted
    expect(createMock).toHaveBeenCalledWith(layer[0]);
  });

  it("derives the order key from in-memory siblings", async () => {
    selectWorkspace();
    const existing = makeNote({ orderHint: Rank.default().get() });
    store.dispatch(notesSlice.actions.upsertNotes([existing]));

    await store.dispatch(createNote({ parentId: null }));

    const layer = selectNotesByParentId(store.getState(), WORKSPACE_ID, null);
    expect(layer).toHaveLength(2);
    // the freshly created note sorts after the pre-existing sibling
    const created = layer.find((n) => n.id !== existing.id);
    expect(created?.orderHint).toBe(new Rank(existing.orderHint).next().get());
  });

  it("rolls the note back out of the store when persistence fails", async () => {
    selectWorkspace();
    createMock.mockReturnValue(dwErrAsync("boom"));

    const result = await store.dispatch(createNote({ parentId: null }));

    expect(result.isErr()).toBe(true);
    expect(
      selectNotesByParentId(store.getState(), WORKSPACE_ID, null),
    ).toHaveLength(0);
  });

  it("does nothing when no workspace is selected", async () => {
    // no selectWorkspace() — session workspaceId stays null
    const result = await store.dispatch(createNote({ parentId: null }));

    expect(result.isErr()).toBe(true);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("navigates only after persistence succeeds", async () => {
    selectWorkspace();
    const seen = vi.fn();
    const unsubscribe = NavigationEventBus.subscribe("note", ({ data }) =>
      seen(data.noteId),
    );

    await store.dispatch(createNote({ parentId: null, navigateAfter: true }));

    const created = createMock.mock.calls[0][0];
    expect(seen).toHaveBeenCalledWith(created.id);
    unsubscribe();
  });

  it("does not navigate when persistence fails", async () => {
    selectWorkspace();
    createMock.mockReturnValue(dwErrAsync("boom"));
    const seen = vi.fn();
    const unsubscribe = NavigationEventBus.subscribe("note", ({ data }) =>
      seen(data.noteId),
    );

    await store.dispatch(createNote({ parentId: null, navigateAfter: true }));

    expect(seen).not.toHaveBeenCalled();
    unsubscribe();
  });
});

describe("duplicateNote", () => {
  let store: AppStore;

  const seed = (...notes: Note[]) =>
    store.dispatch(notesSlice.actions.upsertNotes(notes));

  const seedContent = (noteId: string, document: NoteContent) =>
    store.dispatch(
      editorSlice.actions.initializeDocument({ noteId, document }),
    );

  const layer = (parentId: string | null = null) =>
    selectNotesByParentId(store.getState(), WORKSPACE_ID, parentId);

  beforeEach(() => {
    localStorage.clear();
    createMock.mockReset();
    createMock.mockReturnValue(okAsync(undefined));
    getDocumentMock.mockReset();
    setDocumentMock.mockReset();
    setDocumentMock.mockReturnValue(okAsync(undefined));
    store = createAppStore();
    store.dispatch(appSessionSlice.actions.switchWorkspace(WORKSPACE_ID));
  });

  it("copies the source into a new sibling, suffixing the title", async () => {
    const source = makeNote({ id: "src", title: "Original", icon: "📄" });
    seed(source);
    seedContent("src", makeContent());

    const result = await store.dispatch(duplicateNote("src"));

    expect(result.isOk()).toBe(true);
    // source + copy both live under the same (root) parent
    const ids = layer(null).map((n) => n.id);
    expect(ids).toContain("src");
    expect(ids).toHaveLength(2);

    const copy = layer(null).find((n) => n.id !== "src");
    expect(copy).toMatchObject({
      title: "Original (copy)",
      icon: "📄",
      parentId: null,
      isFavorite: false,
    });
    // a copy is never born favorited
    expect(copy?.favoriteOrderHint).toBe("");
  });

  it("nests the copy under the source's own parent", async () => {
    const source = makeNote({ id: "src", parentId: "folder", title: "N" });
    seed(source);
    seedContent("src", makeContent());

    await store.dispatch(duplicateNote("src"));

    const copy = layer("folder").find((n) => n.id !== "src");
    expect(copy?.parentId).toBe("folder");
  });

  it("persists the copied document under the new note id", async () => {
    const source = makeNote({ id: "src", title: "N" });
    const content = makeContent({
      contents: { type: "doc", content: [{ type: "paragraph" }] },
    });
    seed(source);
    seedContent("src", content);

    await store.dispatch(duplicateNote("src"));

    const created = createMock.mock.calls[0][0];
    expect(setDocumentMock).toHaveBeenCalledTimes(1);
    expect(setDocumentMock).toHaveBeenCalledWith(
      created.id,
      JSON.stringify(content),
    );
  });

  it("reuses cached editor content without hitting the document API", async () => {
    const source = makeNote({ id: "src", title: "N" });
    seed(source);
    seedContent("src", makeContent());

    await store.dispatch(duplicateNote("src"));

    expect(getDocumentMock).not.toHaveBeenCalled();
  });

  it("fetches the document when it is not loaded in the editor", async () => {
    const source = makeNote({ id: "src", title: "N" });
    const content = makeContent({
      contents: { type: "doc", content: [{ type: "heading" }] },
    });
    seed(source);
    // no seedContent — the editor has never loaded this note
    getDocumentMock.mockReturnValue(okAsync({ document: content }));

    const result = await store.dispatch(duplicateNote("src"));

    expect(result.isOk()).toBe(true);
    expect(getDocumentMock).toHaveBeenCalledWith("src");
    const created = createMock.mock.calls[0][0];
    expect(setDocumentMock).toHaveBeenCalledWith(
      created.id,
      JSON.stringify(content),
    );
  });

  it("does not navigate to the duplicate", async () => {
    const source = makeNote({ id: "src", title: "N" });
    seed(source);
    seedContent("src", makeContent());
    const seen = vi.fn();
    const unsubscribe = NavigationEventBus.subscribe("note", ({ data }) =>
      seen(data.noteId),
    );

    await store.dispatch(duplicateNote("src"));

    expect(seen).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("errors and persists nothing when the source does not exist", async () => {
    const result = await store.dispatch(duplicateNote("ghost"));

    expect(result.isErr()).toBe(true);
    expect(createMock).not.toHaveBeenCalled();
    expect(setDocumentMock).not.toHaveBeenCalled();
  });

  it("does not persist a document when creation fails", async () => {
    const source = makeNote({ id: "src", title: "N" });
    seed(source);
    seedContent("src", makeContent());
    createMock.mockReturnValue(dwErrAsync("boom"));

    const result = await store.dispatch(duplicateNote("src"));

    expect(result.isErr()).toBe(true);
    expect(setDocumentMock).not.toHaveBeenCalled();
    // createNote rolls its optimistic insert back out on failure
    expect(layer(null).map((n) => n.id)).toEqual(["src"]);
  });

  it("correctly carries properties over", async () => {
    const properties: NotePropertyMap = {
      Status: { type: PropertyType.Text, value: "Done" },
      "Due date": { type: PropertyType.Date, value: new Date().toISOString() },
      Reviewed: { type: PropertyType.Checkbox, value: false },
    };
    const src = makeNote({ id: nanoid(), title: "Note 1", properties });
    store.dispatch(notesSlice.actions.upsertNotes([src]));

    getDocumentMock.mockReturnValue(
      okAsync({ document: { contents: {}, customizations: {} } }),
    );
    const duplicate = (
      await store.dispatch(duplicateNote(src.id))
    )._unsafeUnwrap();
    expect(duplicate.properties).toEqual(properties);
  });
});

describe("update thunks", () => {
  let store: AppStore;

  const seed = (...notes: Note[]) =>
    store.dispatch(notesSlice.actions.upsertNotes(notes));

  beforeEach(() => {
    localStorage.clear();
    patchMock.mockReset();
    patchMock.mockReturnValue(okAsync(undefined));
    getAllMock.mockReset();
    getAllMock.mockReturnValue(okAsync({ notes: {} }));
    store = createAppStore();
    store.dispatch(appSessionSlice.actions.switchWorkspace(WORKSPACE_ID));
  });

  describe("updateNote", () => {
    it("optimistically applies the patch and persists it", async () => {
      const note = makeNote({ title: "original" });
      seed(note);

      await store.dispatch(updateNote({ id: note.id, title: "edited" }));

      expect(selectNoteById(store.getState(), note.id)?.title).toBe("edited");
      expect(patchMock).toHaveBeenCalledTimes(1);
      expect(patchMock).toHaveBeenCalledWith([
        { id: note.id, title: "edited" },
      ]);
    });

    it("resyncs from the workspace and surfaces the error on failure", async () => {
      const note = makeNote({ title: "original" });
      seed(note);
      patchMock.mockReturnValue(dwErrAsync("boom"));
      // the server still holds the pre-edit note; reconcile must restore it
      getAllMock.mockReturnValue(okAsync({ notes: { [note.id]: note } }));

      const result = await store.dispatch(
        updateNote({ id: note.id, title: "edited" }),
      );

      expect(result.isErr()).toBe(true);
      expect(getAllMock).toHaveBeenCalledWith(WORKSPACE_ID);
      // the optimistic edit is rolled back to server truth once the reload lands
      await vi.waitFor(() =>
        expect(selectNoteById(store.getState(), note.id)?.title).toBe(
          "original",
        ),
      );
    });
  });

  describe("updateManyNotes", () => {
    it("optimistically applies every patch and persists them", async () => {
      const a = makeNote({ title: "a0" });
      const b = makeNote({ title: "b0" });
      seed(a, b);

      const patches = [
        { id: a.id, title: "a1" },
        { id: b.id, title: "b1" },
      ];
      await store.dispatch(updateManyNotes(patches));

      expect(selectNoteById(store.getState(), a.id)?.title).toBe("a1");
      expect(selectNoteById(store.getState(), b.id)?.title).toBe("b1");
      expect(patchMock).toHaveBeenCalledWith(patches);
    });

    it("resyncs from the workspace and surfaces the error on failure", async () => {
      const a = makeNote({ title: "a0" });
      const b = makeNote({ title: "b0" });
      seed(a, b);
      patchMock.mockReturnValue(dwErrAsync("boom"));
      getAllMock.mockReturnValue(okAsync({ notes: { [a.id]: a, [b.id]: b } }));

      const result = await store.dispatch(
        updateManyNotes([
          { id: a.id, title: "a1" },
          { id: b.id, title: "b1" },
        ]),
      );

      expect(result.isErr()).toBe(true);
      expect(getAllMock).toHaveBeenCalledWith(WORKSPACE_ID);
      await vi.waitFor(() => {
        expect(selectNoteById(store.getState(), a.id)?.title).toBe("a0");
        expect(selectNoteById(store.getState(), b.id)?.title).toBe("b0");
      });
    });
  });
});

describe("moveNote", () => {
  let store: AppStore;
  const DEST = "p-dest";

  const seed = (...notes: Note[]) =>
    store.dispatch(notesSlice.actions.upsertNotes(notes));

  const rankOf = (id: string) =>
    selectNoteById(store.getState(), id)?.orderHint ?? "";

  beforeEach(() => {
    localStorage.clear();
    patchMock.mockReset();
    patchMock.mockReturnValue(okAsync(undefined));
    getAllMock.mockReset();
    getAllMock.mockReturnValue(okAsync({ notes: {} }));
    store = createAppStore();
    store.dispatch(appSessionSlice.actions.switchWorkspace(WORKSPACE_ID));
  });

  /** Two siblings in DEST, ascending: a then b. */
  const seedLayer = () => {
    const a = makeNote({ parentId: DEST, orderHint: Rank.default().get() });
    const b = makeNote({
      parentId: DEST,
      orderHint: new Rank(a.orderHint).next().get(),
    });
    return { a, b };
  };

  it("errors and persists nothing when the source does not exist", async () => {
    const result = await store.dispatch(moveNote("ghost", null));

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it("places the note after every sibling when moving to the end", async () => {
    const { a, b } = seedLayer();
    const source = makeNote({ parentId: null });
    seed(a, b, source);

    await store.dispatch(moveNote(source.id, DEST, "end"));

    expect(selectNoteById(store.getState(), source.id)?.parentId).toBe(DEST);
    expect(Rank.sorter(rankOf(source.id), a.orderHint)).toBe(1);
    expect(Rank.sorter(rankOf(source.id), b.orderHint)).toBe(1);
  });

  it("places the note before every sibling when moving to the start", async () => {
    const { a, b } = seedLayer();
    const source = makeNote({ parentId: null });
    seed(a, b, source);

    await store.dispatch(moveNote(source.id, DEST, "start"));

    expect(Rank.sorter(rankOf(source.id), a.orderHint)).toBe(-1);
    expect(Rank.sorter(rankOf(source.id), b.orderHint)).toBe(-1);
  });

  it("excludes the source from the layer when reordering in place", async () => {
    const { a, b } = seedLayer();
    // source currently sorts LAST within DEST
    const source = makeNote({
      parentId: DEST,
      orderHint: new Rank(b.orderHint).next().get(),
    });
    seed(a, b, source);

    await store.dispatch(moveNote(source.id, DEST, "start"));

    // it landed before a, and did not anchor on its own (previously-last) key
    expect(Rank.sorter(rankOf(source.id), a.orderHint)).toBe(-1);
    expect(rankOf(source.id)).not.toBe(source.orderHint);
  });

  it("updates the parent when moving across layers", async () => {
    const source = makeNote({ parentId: "p1" });
    seed(source);

    await store.dispatch(moveNote(source.id, "p2", "end"));

    expect(selectNoteById(store.getState(), source.id)?.parentId).toBe("p2");
  });

  it("persists exactly the computed patch", async () => {
    const source = makeNote({ parentId: null });
    seed(source);

    await store.dispatch(moveNote(source.id, DEST, "end"));

    expect(patchMock).toHaveBeenCalledTimes(1);
    expect(patchMock).toHaveBeenCalledWith([
      { id: source.id, parentId: DEST, orderHint: rankOf(source.id) },
    ]);
  });

  it("assigns a valid key without throwing when the boundary note is corrupt", async () => {
    const corrupt = makeNote({ parentId: DEST, orderHint: "" });
    const source = makeNote({ parentId: null });
    seed(corrupt, source);

    const result = await store.dispatch(moveNote(source.id, DEST, "end"));

    expect(result.isOk()).toBe(true);
    expect(Rank.isValid(rankOf(source.id))).toBe(true);
  });

  it("derives from the default rank for an empty destination", async () => {
    const source = makeNote({ parentId: null });
    seed(source);

    await store.dispatch(moveNote(source.id, "empty-dest", "end"));

    expect(rankOf(source.id)).toBe(Rank.default().next().get());
  });

  it("refuses to move a note into one of its descendants", async () => {
    // P > C > G
    seed(
      makeNote({ id: "P", parentId: null }),
      makeNote({ id: "C", parentId: "P" }),
      makeNote({ id: "G", parentId: "C" }),
    );

    const result = await store.dispatch(moveNote("P", "G", "end"));

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it("refuses to move a note into itself", async () => {
    seed(makeNote({ id: "P", parentId: null }));

    const result = await store.dispatch(moveNote("P", "P", "end"));

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it("allows moving a note into its own current parent", async () => {
    seed(
      makeNote({ id: "P", parentId: null }),
      makeNote({ id: "C", parentId: "P" }),
    );

    // C -> P is not a cycle (P is not a descendant of C)
    const result = await store.dispatch(moveNote("C", "P", "end"));

    expect(result.isOk()).toBe(true);
  });
});

describe("reorderNote", () => {
  let store: AppStore;
  const DEST = "p-dest";

  const seed = (...notes: Note[]) =>
    store.dispatch(notesSlice.actions.upsertNotes(notes));

  const rankOf = (id: string) =>
    selectNoteById(store.getState(), id)?.orderHint ?? "";

  /** DEST layer ids in display (sorted) order. */
  const layerIds = () =>
    selectNotesByParentId(store.getState(), WORKSPACE_ID, DEST).map(
      (n) => n.id,
    );

  beforeEach(() => {
    localStorage.clear();
    patchMock.mockReset();
    patchMock.mockReturnValue(okAsync(undefined));
    getAllMock.mockReset();
    getAllMock.mockReturnValue(okAsync({ notes: {} }));
    store = createAppStore();
    store.dispatch(appSessionSlice.actions.switchWorkspace(WORKSPACE_ID));
  });

  /** Three clean, ascending siblings in DEST: a < b < c. */
  const seedTriplet = () => {
    const a = makeNote({ id: "a", parentId: DEST, orderHint: "a1" });
    const b = makeNote({ id: "b", parentId: DEST, orderHint: "a2" });
    const c = makeNote({ id: "c", parentId: DEST, orderHint: "a3" });
    return { a, b, c };
  };

  it("errors when the source does not exist", async () => {
    const result = await store.dispatch(
      reorderNote("ghost", "anchor", "below"),
    );

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it("errors when the anchor does not exist", async () => {
    const source = makeNote({ parentId: null });
    seed(source);

    const result = await store.dispatch(
      reorderNote(source.id, "ghost", "below"),
    );

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it("errors when reordering a note relative to itself", async () => {
    const source = makeNote({ parentId: DEST, orderHint: "a1" });
    seed(source);

    // source is filtered out of its own layer, so it can't be its own anchor
    const result = await store.dispatch(
      reorderNote(source.id, source.id, "below"),
    );

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it("places the note between the anchor and its lower neighbor (below)", async () => {
    const { a, b, c } = seedTriplet();
    const source = makeNote({ id: "src", parentId: null });
    seed(a, b, c, source);

    // below b -> between b and c
    await store.dispatch(reorderNote(source.id, b.id, "below"));

    expect(layerIds()).toEqual(["a", "b", "src", "c"]);
    expect(selectNoteById(store.getState(), source.id)?.parentId).toBe(DEST);
  });

  it("places the note between the anchor and its upper neighbor (above)", async () => {
    const { a, b, c } = seedTriplet();
    const source = makeNote({ id: "src", parentId: null });
    seed(a, b, c, source);

    // above b -> between a and b
    await store.dispatch(reorderNote(source.id, b.id, "above"));

    expect(layerIds()).toEqual(["a", "src", "b", "c"]);
  });

  it("delegates to the list start when dropped above the first sibling", async () => {
    const { a, b, c } = seedTriplet();
    const source = makeNote({ id: "src", parentId: null });
    seed(a, b, c, source);

    await store.dispatch(reorderNote(source.id, a.id, "above"));

    expect(layerIds()).toEqual(["src", "a", "b", "c"]);
    expect(patchMock).toHaveBeenCalledTimes(1); // proves the delegate dispatched
  });

  it("delegates to the list end when dropped below the last sibling", async () => {
    const { a, b, c } = seedTriplet();
    const source = makeNote({ id: "src", parentId: null });
    seed(a, b, c, source);

    await store.dispatch(reorderNote(source.id, c.id, "below"));

    expect(layerIds()).toEqual(["a", "b", "c", "src"]);
    expect(patchMock).toHaveBeenCalledTimes(1);
  });

  it("rebalances the layer when anchor and neighbor collide", async () => {
    // a and b share the same key: the target gap has no midpoint
    const a = makeNote({ id: "a", parentId: DEST, orderHint: "a5" });
    const b = makeNote({ id: "b", parentId: DEST, orderHint: "a5" });
    const source = makeNote({ id: "src", parentId: null });
    seed(a, b, source);

    // below a -> between a and b (which collide) -> rebalance path
    const result = await store.dispatch(reorderNote(source.id, a.id, "below"));

    expect(result.isOk()).toBe(true);
    expect(layerIds()).toEqual(["a", "src", "b"]);
    // every key is now valid and distinct
    const keys = [rankOf("a"), rankOf("src"), rankOf("b")];
    expect(keys.every((k) => Rank.isValid(k))).toBe(true);
    expect(new Set(keys).size).toBe(3);
  });

  it("rebalances the layer when a neighbor key is corrupt", async () => {
    const a = makeNote({ id: "a", parentId: DEST, orderHint: "a1" });
    // corrupt key sorts to the front of the layer
    const corrupt = makeNote({ id: "cor", parentId: DEST, orderHint: "" });
    const source = makeNote({ id: "src", parentId: null });
    seed(a, corrupt, source);

    // above a -> neighbor is the corrupt note -> rebalance path
    const result = await store.dispatch(reorderNote(source.id, a.id, "above"));

    expect(result.isOk()).toBe(true);
    expect(layerIds()).toEqual(["cor", "src", "a"]);
    const keys = [rankOf("cor"), rankOf("src"), rankOf("a")];
    expect(keys.every((k) => Rank.isValid(k))).toBe(true);
    expect(new Set(keys).size).toBe(3);
  });

  it("moves the note across layers, adopting the anchor's parent", async () => {
    const { a, b } = seedTriplet();
    const source = makeNote({ id: "src", parentId: "other-parent" });
    seed(a, b, source);

    await store.dispatch(reorderNote(source.id, a.id, "below"));

    expect(selectNoteById(store.getState(), source.id)?.parentId).toBe(DEST);
    expect(layerIds()).toEqual(["a", "src", "b"]);
  });

  it("refuses to reorder against an anchor inside its own subtree", async () => {
    // P > C > G; reordering P next to G would nest P under itself
    seed(
      makeNote({ id: "P", parentId: null }),
      makeNote({ id: "C", parentId: "P" }),
      makeNote({ id: "G", parentId: "C" }),
    );

    const result = await store.dispatch(reorderNote("P", "G", "below"));

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it("refuses to reorder a note next to its own direct child", async () => {
    // anchor C's parent is P (the source): adopting it re-parents P under itself
    seed(
      makeNote({ id: "P", parentId: null }),
      makeNote({ id: "C", parentId: "P" }),
    );

    const result = await store.dispatch(reorderNote("P", "C", "above"));

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });
});

describe("reorderFavorite", () => {
  let store: AppStore;

  const seed = (...notes: Note[]) =>
    store.dispatch(notesSlice.actions.upsertNotes(notes));

  const favRankOf = (id: string) =>
    selectNoteById(store.getState(), id)?.favoriteOrderHint ?? "";

  /** Favorite ids in display (sorted) order. */
  const favIds = () =>
    selectFavorites(store.getState(), WORKSPACE_ID).map((n) => n.id);

  /** Marks a note as a favorite with the given order key. */
  const fav = (id: string, favoriteOrderHint: string): Note =>
    makeNote({ id, isFavorite: true, favoriteOrderHint });

  beforeEach(() => {
    localStorage.clear();
    patchMock.mockReset();
    patchMock.mockReturnValue(okAsync(undefined));
    getAllMock.mockReset();
    getAllMock.mockReturnValue(okAsync({ notes: {} }));
    store = createAppStore();
    store.dispatch(appSessionSlice.actions.switchWorkspace(WORKSPACE_ID));
  });

  /** Three clean, ascending favorites: fa < fb < fc. */
  const seedTriplet = () => {
    const fa = fav("fa", "a1");
    const fb = fav("fb", "a2");
    const fc = fav("fc", "a3");
    return { fa, fb, fc };
  };

  it("errors when the source does not exist", async () => {
    const result = await store.dispatch(reorderFavorite("ghost", "anchor"));

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it("errors when the anchor does not exist", async () => {
    const source = makeNote();
    seed(source);

    const result = await store.dispatch(reorderFavorite(source.id, "ghost"));

    expect(result.isErr()).toBe(true);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it("favorites into the default slot when the list is empty", async () => {
    const source = makeNote();
    seed(source);

    await store.dispatch(reorderFavorite(source.id));

    expect(selectNoteById(store.getState(), source.id)?.isFavorite).toBe(true);
    expect(favRankOf(source.id)).toBe(Rank.default().get());
    expect(favIds()).toEqual([source.id]);
  });

  it("appends after the last favorite when no anchor is given", async () => {
    const { fa, fb } = seedTriplet();
    const source = makeNote();
    seed(fa, fb, source);

    await store.dispatch(reorderFavorite(source.id));

    expect(favIds()).toEqual(["fa", "fb", source.id]);
    expect(Rank.sorter(favRankOf(source.id), fb.favoriteOrderHint)).toBe(1);
  });

  it("marks a plain note as favorite when inserted via an anchor", async () => {
    const { fa, fb, fc } = seedTriplet();
    const source = makeNote();
    seed(fa, fb, fc, source);

    await store.dispatch(reorderFavorite(source.id, "fb", "below"));

    expect(selectNoteById(store.getState(), source.id)?.isFavorite).toBe(true);
  });

  it("places the favorite between the anchor and its lower neighbor (below)", async () => {
    const { fa, fb, fc } = seedTriplet();
    const source = makeNote();
    seed(fa, fb, fc, source);

    // below fb -> between fb and fc
    await store.dispatch(reorderFavorite(source.id, "fb", "below"));

    expect(favIds()).toEqual(["fa", "fb", source.id, "fc"]);
  });

  it("places the favorite between the anchor and its upper neighbor (above)", async () => {
    const { fa, fb, fc } = seedTriplet();
    const source = makeNote();
    seed(fa, fb, fc, source);

    // above fb -> between fa and fb
    await store.dispatch(reorderFavorite(source.id, "fb", "above"));

    expect(favIds()).toEqual(["fa", source.id, "fb", "fc"]);
  });

  it("appends to the end when dropped below the last favorite", async () => {
    const { fa, fb, fc } = seedTriplet();
    const source = makeNote();
    seed(fa, fb, fc, source);

    await store.dispatch(reorderFavorite(source.id, "fc", "below"));

    expect(favIds()).toEqual(["fa", "fb", "fc", source.id]);
    expect(patchMock).toHaveBeenCalledTimes(1); // proves the delegate dispatched
  });

  it("prepends before the first favorite when dropped above it", async () => {
    const { fa, fb, fc } = seedTriplet();
    const source = makeNote();
    seed(fa, fb, fc, source);

    await store.dispatch(reorderFavorite(source.id, "fa", "above"));

    expect(favIds()).toEqual([source.id, "fa", "fb", "fc"]);
    expect(Rank.sorter(favRankOf(source.id), fa.favoriteOrderHint)).toBe(-1);
  });

  it("excludes an already-favorited source from its own layer", async () => {
    // source is already a favorite sitting LAST; moving it up must not
    // anchor on its own stale key nor emit a duplicate patch for itself
    const { fa, fb, fc } = seedTriplet();
    const source = fav("src", "a4");
    seed(fa, fb, fc, source);

    await store.dispatch(reorderFavorite("src", "fb", "above"));

    expect(favIds()).toEqual(["fa", "src", "fb", "fc"]);
    // the mover appears exactly once across everything persisted
    const persisted = patchMock.mock.calls.flatMap((c) => c[0]);
    expect(persisted.filter((p) => p.id === "src")).toHaveLength(1);
  });

  it("rebalances the layer when anchor and neighbor collide", async () => {
    // fa and fb share the same key: the target gap has no midpoint
    const fa = fav("fa", "a5");
    const fb = fav("fb", "a5");
    const source = makeNote();
    seed(fa, fb, source);

    // below fa -> between fa and fb (which collide) -> rebalance path
    const result = await store.dispatch(
      reorderFavorite(source.id, "fa", "below"),
    );

    expect(result.isOk()).toBe(true);
    expect(favIds()).toEqual(["fa", source.id, "fb"]);
    const keys = [favRankOf("fa"), favRankOf(source.id), favRankOf("fb")];
    expect(keys.every((k) => Rank.isValid(k))).toBe(true);
    expect(new Set(keys).size).toBe(3);
  });

  it("does not emit a duplicate patch when rebalancing an existing favorite", async () => {
    // colliding anchors AND an already-favorited source: the rebalance must
    // drop the mover from the layer so it is patched once, not twice
    const fa = fav("fa", "a5");
    const fb = fav("fb", "a5");
    const source = fav("src", "a1"); // already a favorite, sorts first
    seed(fa, fb, source);

    const result = await store.dispatch(reorderFavorite("src", "fa", "below"));

    expect(result.isOk()).toBe(true);
    expect(favIds()).toEqual(["fa", "src", "fb"]);
    const persisted = patchMock.mock.calls.flatMap((c) => c[0]);
    expect(persisted.filter((p) => p.id === "src")).toHaveLength(1);
  });

  it("rebalances the layer when a neighbor key is corrupt", async () => {
    const fa = fav("fa", "a1");
    // corrupt key sorts to the front of the layer
    const corrupt = fav("cor", "");
    const source = makeNote();
    seed(fa, corrupt, source);

    // above fa -> neighbor is the corrupt favorite -> rebalance path
    const result = await store.dispatch(
      reorderFavorite(source.id, "fa", "above"),
    );

    expect(result.isOk()).toBe(true);
    expect(favIds()).toEqual(["cor", source.id, "fa"]);
    const keys = [favRankOf("cor"), favRankOf(source.id), favRankOf("fa")];
    expect(keys.every((k) => Rank.isValid(k))).toBe(true);
    expect(new Set(keys).size).toBe(3);
  });
});

describe("trash + favorite status thunks", () => {
  let store: AppStore;

  const seed = (...notes: Note[]) =>
    store.dispatch(notesSlice.actions.upsertNotes(notes));

  const layerIds = (parentId: string | null = null) =>
    selectNotesByParentId(store.getState(), WORKSPACE_ID, parentId).map(
      (n) => n.id,
    );

  const favIds = () =>
    selectFavorites(store.getState(), WORKSPACE_ID).map((n) => n.id);

  beforeEach(() => {
    localStorage.clear();
    patchMock.mockReset();
    patchMock.mockReturnValue(okAsync(undefined));
    getAllMock.mockReset();
    getAllMock.mockReturnValue(okAsync({ notes: {} }));
    store = createAppStore();
    store.dispatch(appSessionSlice.actions.switchWorkspace(WORKSPACE_ID));
  });

  describe("moveToTrash", () => {
    it("flags the note trashed and persists the patch", async () => {
      const note = makeNote({ id: "n" });
      seed(note);

      await store.dispatch(moveToTrash("n"));

      const trashed = selectNoteById(store.getState(), "n");
      expect(trashed?.isTrashed).toBe(true);
      // the deletion time is stamped so trash can be ordered by it later
      expect(trashed?.trashedAt).toEqual(expect.any(String));
      expect(patchMock).toHaveBeenCalledWith([
        expect.objectContaining({
          id: "n",
          isTrashed: true,
          trashedAt: expect.any(String),
        }),
      ]);
    });

    it("removes the note from its parent layer", async () => {
      const a = makeNote({ id: "a", orderHint: "a1" });
      const b = makeNote({ id: "b", orderHint: "a2" });
      seed(a, b);

      await store.dispatch(moveToTrash("a"));

      expect(layerIds()).toEqual(["b"]);
    });

    it("drops a trashed note out of favorites without unfavoriting it", async () => {
      const note = makeNote({
        id: "n",
        isFavorite: true,
        favoriteOrderHint: "a1",
      });
      seed(note);

      await store.dispatch(moveToTrash("n"));

      // still marked favorite, just excluded from the favorites view
      expect(selectNoteById(store.getState(), "n")?.isFavorite).toBe(true);
      expect(favIds()).toEqual([]);
    });

    it("resyncs from the workspace on persistence failure", async () => {
      const note = makeNote({ id: "n" });
      seed(note);
      patchMock.mockReturnValue(dwErrAsync("boom"));
      getAllMock.mockReturnValue(okAsync({ notes: { n: note } }));

      const result = await store.dispatch(moveToTrash("n"));

      expect(result.isErr()).toBe(true);
      await vi.waitFor(() =>
        expect(selectNoteById(store.getState(), "n")?.isTrashed).toBe(false),
      );
    });
  });

  describe("restoreFromTrash", () => {
    it("clears the trashed flag and returns the note to its layer", async () => {
      const note = makeNote({
        id: "n",
        isTrashed: true,
        trashedAt: new Date().toISOString(),
      });
      seed(note);

      await store.dispatch(restoreFromTrash("n"));

      const restored = selectNoteById(store.getState(), "n");
      expect(restored?.isTrashed).toBe(false);
      // the deletion stamp is cleared on the way out of the trash
      expect(restored?.trashedAt).toBeNull();
      expect(layerIds()).toEqual(["n"]);
      expect(patchMock).toHaveBeenCalledWith([
        { id: "n", isTrashed: false, trashedAt: null },
      ]);
    });

    it("restores a favorite back into its old slot, key preserved", async () => {
      const fa = makeNote({
        id: "fa",
        isFavorite: true,
        favoriteOrderHint: "a1",
      });
      const restored = makeNote({
        id: "r",
        isFavorite: true,
        favoriteOrderHint: "a2",
        isTrashed: true,
      });
      const fc = makeNote({
        id: "fc",
        isFavorite: true,
        favoriteOrderHint: "a3",
      });
      seed(fa, restored, fc);
      // while trashed it is hidden from favorites
      expect(favIds()).toEqual(["fa", "fc"]);

      await store.dispatch(restoreFromTrash("r"));

      expect(favIds()).toEqual(["fa", "r", "fc"]);
      expect(selectNoteById(store.getState(), "r")?.favoriteOrderHint).toBe(
        "a2",
      );
    });
  });

  describe("unfavorite", () => {
    it("clears the favorite flag and drops it from the favorites view", async () => {
      const note = makeNote({
        id: "n",
        isFavorite: true,
        favoriteOrderHint: "a1",
      });
      seed(note);

      await store.dispatch(unfavorite("n"));

      expect(selectNoteById(store.getState(), "n")?.isFavorite).toBe(false);
      expect(favIds()).toEqual([]);
      expect(patchMock).toHaveBeenCalledWith([{ id: "n", isFavorite: false }]);
    });

    it("leaves the stale order key untouched", async () => {
      const note = makeNote({
        id: "n",
        isFavorite: true,
        favoriteOrderHint: "a1",
      });
      seed(note);

      await store.dispatch(unfavorite("n"));

      expect(selectNoteById(store.getState(), "n")?.favoriteOrderHint).toBe(
        "a1",
      );
    });
  });
});

describe("permanentlyDeleteNote", () => {
  let store: AppStore;

  const seed = (...notes: Note[]) =>
    store.dispatch(notesSlice.actions.upsertNotes(notes));

  beforeEach(() => {
    localStorage.clear();
    deleteMock.mockReset();
    deleteMock.mockReturnValue(okAsync(undefined));
    store = createAppStore();
    store.dispatch(appSessionSlice.actions.switchWorkspace(WORKSPACE_ID));
    window.location.hash = "";
  });

  it("removes the note from the store and calls the delete API", async () => {
    const note = makeNote({ id: "n" });
    seed(note);

    await store.dispatch(permanentlyDeleteNote("n"));

    expect(selectNoteById(store.getState(), "n")).toBeUndefined();
    expect(deleteMock).toHaveBeenCalledWith("n");
  });

  it("restores the note into the store when deletion fails", async () => {
    const note = makeNote({ id: "n", title: "keep me" });
    seed(note);
    deleteMock.mockReturnValue(dwErrAsync("boom"));

    const result = await store.dispatch(permanentlyDeleteNote("n"));

    expect(result.isErr()).toBe(true);
    expect(selectNoteById(store.getState(), "n")?.title).toBe("keep me");
  });

  it("navigates home when deleting the note currently open", async () => {
    const note = makeNote({ id: "n" });
    seed(note);
    window.location.hash = "#/page/n";
    const routes: string[] = [];
    const unsub = NavigationEventBus.subscribe("onRouteChanged", ({ data }) =>
      routes.push(data),
    );

    await store.dispatch(permanentlyDeleteNote("n"));

    expect(routes).toContain("/");
    unsub();
  });

  it("does not navigate when a different note is open", async () => {
    const note = makeNote({ id: "n" });
    seed(note);
    window.location.hash = "#/page/other";
    const routes: string[] = [];
    const unsub = NavigationEventBus.subscribe("onRouteChanged", ({ data }) =>
      routes.push(data),
    );

    await store.dispatch(permanentlyDeleteNote("n"));

    expect(routes).not.toContain("/");
    unsub();
  });

  it("does not navigate when deletion fails", async () => {
    const note = makeNote({ id: "n" });
    seed(note);
    deleteMock.mockReturnValue(dwErrAsync("boom"));
    window.location.hash = "#/page/n";
    const routes: string[] = [];
    const unsub = NavigationEventBus.subscribe("onRouteChanged", ({ data }) =>
      routes.push(data),
    );

    await store.dispatch(permanentlyDeleteNote("n"));

    expect(routes).not.toContain("/");
    unsub();
  });
});

describe("clearTrash", () => {
  let store: AppStore;

  const seed = (...notes: Note[]) =>
    store.dispatch(notesSlice.actions.upsertNotes(notes));

  beforeEach(() => {
    localStorage.clear();
    clearTrashMock.mockReset();
    clearTrashMock.mockReturnValue(okAsync(undefined));
    getAllMock.mockReset();
    getAllMock.mockReturnValue(okAsync({ notes: {} }));
    store = createAppStore();
    store.dispatch(appSessionSlice.actions.switchWorkspace(WORKSPACE_ID));
    window.location.hash = "";
  });

  it("removes every trashed note but keeps the live ones", async () => {
    const live = makeNote({ id: "live" });
    const t1 = makeNote({ id: "t1", isTrashed: true });
    const t2 = makeNote({ id: "t2", isTrashed: true });
    seed(live, t1, t2);

    await store.dispatch(clearTrash());

    expect(selectNoteById(store.getState(), "live")).toBeDefined();
    expect(selectNoteById(store.getState(), "t1")).toBeUndefined();
    expect(selectNoteById(store.getState(), "t2")).toBeUndefined();
    expect(selectNoteIdsInTrash(store.getState(), WORKSPACE_ID)).toEqual([]);
    expect(clearTrashMock).toHaveBeenCalledWith(WORKSPACE_ID);
  });

  it("navigates home when the open note is being purged", async () => {
    seed(makeNote({ id: "t1", isTrashed: true }));
    window.location.hash = "#/page/t1";
    const routes: string[] = [];
    const unsub = NavigationEventBus.subscribe("onRouteChanged", ({ data }) =>
      routes.push(data),
    );

    await store.dispatch(clearTrash());

    expect(routes).toContain("/");
    unsub();
  });

  it("stays put when the open note is not in the trash", async () => {
    seed(makeNote({ id: "live" }), makeNote({ id: "t1", isTrashed: true }));
    window.location.hash = "#/page/live";
    const routes: string[] = [];
    const unsub = NavigationEventBus.subscribe("onRouteChanged", ({ data }) =>
      routes.push(data),
    );

    await store.dispatch(clearTrash());

    expect(routes).not.toContain("/");
    unsub();
  });

  it("resyncs from the workspace when the purge fails", async () => {
    const t1 = makeNote({ id: "t1", isTrashed: true });
    seed(t1);
    clearTrashMock.mockReturnValue(dwErrAsync("boom"));
    getAllMock.mockReturnValue(okAsync({ notes: { t1 } }));

    const result = await store.dispatch(clearTrash());

    expect(result.isErr()).toBe(true);
    expect(getAllMock).toHaveBeenCalledWith(WORKSPACE_ID);
    await vi.waitFor(() =>
      expect(selectNoteById(store.getState(), "t1")).toBeDefined(),
    );
  });

  it("errors and purges nothing when no workspace is active", async () => {
    // fresh store with no workspace switched in
    localStorage.clear();
    store = createAppStore();
    seed(makeNote({ id: "t1", isTrashed: true, workspaceId: WORKSPACE_ID }));

    const result = await store.dispatch(clearTrash());

    expect(result.isErr()).toBe(true);
    expect(clearTrashMock).not.toHaveBeenCalled();
    expect(selectNoteById(store.getState(), "t1")).toBeDefined();
  });
});
