import { describe, expect, it } from "vitest";
import { type Note, type OrderKey, stableSortByOrderKeyFn } from "./note";
import { Rank } from "./rank";
import { rebalanceLayer } from "./rank-correction";

let idCounter = 0;

function makeNote(overrides: Partial<Note> = {}): Note {
  const id = overrides.id ?? `note-${idCounter++}`;
  return {
    id,
    title: "untitled",
    icon: null,
    parentId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    modifiedAt: "2026-01-01T00:00:00.000Z",
    trashedAt: null,
    orderHint: Rank.default().get(),
    favoriteOrderHint: Rank.default().get(),
    isFavorite: null,
    isTrashed: null,
    workspaceId: "ws",
    properties: {},
    propertyOrder: [],
    ...overrides,
  };
}

/** Build a layer with the given order keys, in the order supplied. */
function layer(hints: string[], key: OrderKey = "orderHint"): Note[] {
  return hints.map((hint, i) => makeNote({ id: `n${i}`, [key]: hint }));
}

describe("rebalanceLayer", () => {
  it("returns an empty diff for an empty layer", () => {
    expect(rebalanceLayer([], "orderHint")).toEqual([]);
  });

  it("emits exactly one diff per note, covering every id", () => {
    const notes = layer(["a5", "a1", "a3"]);
    const diffs = rebalanceLayer(notes, "orderHint");

    expect(diffs).toHaveLength(notes.length);
    expect(new Set(diffs.map((d) => d.id))).toEqual(
      new Set(notes.map((n) => n.id)),
    );
  });

  it("assigns strictly ascending, distinct keys in output order", () => {
    const diffs = rebalanceLayer(layer(["a9", "a2", "a5", "a0"]), "orderHint");
    const keys = diffs.map((d) => d.orderHint);

    expect(new Set(keys).size).toBe(keys.length);
    for (let i = 1; i < keys.length; i++) {
      expect(Rank.sorter(keys[i - 1], keys[i])).toBe(-1);
    }
  });

  it("emits diffs in the same order stableSortByOrderKeyFn would produce", () => {
    const notes = layer(["a5", "a1", "a3", "a2"]);
    const expectedOrder = notes
      .toSorted(stableSortByOrderKeyFn("orderHint"))
      .map((n) => n.id);

    const diffs = rebalanceLayer(notes, "orderHint");
    expect(diffs.map((d) => d.id)).toEqual(expectedOrder);
  });

  it("breaks rank collisions by id (immutable tiebreaker)", () => {
    // three notes share the exact same orderHint
    const notes = [
      makeNote({ id: "c", orderHint: "a5" }),
      makeNote({ id: "a", orderHint: "a5" }),
      makeNote({ id: "b", orderHint: "a5" }),
    ];
    const diffs = rebalanceLayer(notes, "orderHint");

    // tiebreak is a.id.localeCompare(b.id) -> a, b, c
    expect(diffs.map((d) => d.id)).toEqual(["a", "b", "c"]);
    const keys = diffs.map((d) => d.orderHint);
    for (let i = 1; i < keys.length; i++) {
      expect(Rank.sorter(keys[i - 1], keys[i])).toBe(-1);
    }
  });

  it("does not mutate the input notes", () => {
    const notes = layer(["a5", "a1", "a3"]);
    const snapshot = structuredClone(notes);

    rebalanceLayer(notes, "orderHint");
    expect(notes).toEqual(snapshot);
  });

  it("is idempotent: rebalancing balanced output reproduces the same keys", () => {
    const notes = layer(["a9", "a2", "a5"]);
    const first = rebalanceLayer(notes, "orderHint");

    // apply the diff, then rebalance again
    const applied = notes.map((n) => {
      const diff = first.find((d) => d.id === n.id);
      return diff ? { ...n, orderHint: diff.orderHint } : n;
    });
    const second = rebalanceLayer(applied, "orderHint");

    expect(second).toEqual(first);
  });

  it("writes the favoriteOrderHint field when keyed on favorites", () => {
    const notes = layer(["a5", "a1"], "favoriteOrderHint");
    const diffs = rebalanceLayer(notes, "favoriteOrderHint");

    for (const diff of diffs) {
      expect(diff).toHaveProperty("favoriteOrderHint");
      expect(diff).not.toHaveProperty("orderHint");
    }
  });
});
