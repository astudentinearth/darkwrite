// @vitest-environment jsdom
import { dwErrAsync, type Note, Rank } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DarkwriteAPIClient } from "@/api/api-client";
import { NavigationEventBus } from "@/features/navigation/navigator";
import { appSessionSlice } from "@/features/session/session-slice";
import { type AppStore, createAppStore } from "@/features/store/redux";
import { createNote, getCreationRank } from "./note.thunk";
import { selectNotesByParentId } from "./note-selectors";
import { notesSlice } from "./note-slice";

vi.mock("@/api/api-client", () => ({
  DarkwriteAPIClient: { note: { create: vi.fn() } },
}));

const WORKSPACE_ID = "ws-1";
const createMock = vi.mocked(DarkwriteAPIClient.note.create);

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
