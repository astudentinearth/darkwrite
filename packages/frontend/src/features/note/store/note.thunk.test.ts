// @vitest-environment jsdom
import { dwErrAsync, type Note, Rank } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DarkwriteAPIClient } from "@/api/api-client";
import { NavigationEventBus } from "@/features/navigation/navigator";
import { appSessionSlice } from "@/features/session/session-slice";
import { type AppStore, createAppStore } from "@/features/store/redux";
import {
  createNote,
  getCreationRank,
  moveNote,
  updateManyNotes,
  updateNote,
} from "./note.thunk";
import { selectNoteById, selectNotesByParentId } from "./note-selectors";
import { notesSlice } from "./note-slice";

vi.mock("@/api/api-client", () => ({
  DarkwriteAPIClient: {
    note: {
      create: vi.fn(),
      patchAll: vi.fn(),
      getAllByWorkspaceId: vi.fn(),
    },
  },
}));

const WORKSPACE_ID = "ws-1";
const createMock = vi.mocked(DarkwriteAPIClient.note.create);
const patchMock = vi.mocked(DarkwriteAPIClient.note.patchAll);
const getAllMock = vi.mocked(DarkwriteAPIClient.note.getAllByWorkspaceId);

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
});
