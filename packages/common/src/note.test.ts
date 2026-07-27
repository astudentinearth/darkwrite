import type { NoteDTO } from "./dto";
import { isDescendant, resolveUpperTree } from "./note";

test("should resolve the parent tree of a note", () => {
  const notes = {
    a: { id: "a", parentId: null },
    b: { id: "b", parentId: "a" },
    c: { id: "c", parentId: null },
  } as unknown as Record<string, NoteDTO>;

  const result = resolveUpperTree("b", notes);
  expect(result.findIndex((n) => n.id === "c")).toBe(-1);
  expect(result.findIndex((n) => n.id === "b")).toBe(-1);
  expect(result.findIndex((n) => n.id === "a")).not.toBe(-1);
});

describe("isDescendant", () => {
  it("should break gracefully on circular references", () => {
    const notes = {
      a: { id: "a", parentId: "b" },
      b: { id: "b", parentId: "c" },
      c: { id: "c", parentId: "a" },
    } as unknown as Record<string, NoteDTO>;

    expect(
      isDescendant("a", "d", notes),
      "what happens if a test candidate does not exist at all?",
    ).toBe(false);
    expect(isDescendant("a", "a", notes)).toBe("CIRCULAR");
    expect(isDescendant("a", "b", notes)).toBe("CIRCULAR");
    expect(isDescendant("a", "c", notes)).toBe("CIRCULAR");
  });

  it("should return true for direct descendants", () => {
    const notes = {
      a: { id: "a", parentId: null },
      b: { id: "b", parentId: "a" },
    } as unknown as Record<string, NoteDTO>;

    expect(isDescendant("b", "a", notes)).toBe(true);
  });

  it("should return true for indirect descendants", () => {
    const notes = {
      a: { id: "a", parentId: null },
      b: { id: "b", parentId: "a" },
      c: { id: "c", parentId: "b" },
    } as unknown as Record<string, NoteDTO>;

    expect(isDescendant("c", "a", notes)).toBe(true);
  });

  it("should correctly handle candidates that don't exist in the data set", () => {
    const notes = {
      a: { id: "a", parentId: null },
      b: { id: "b", parentId: "a" },
      c: { id: "c", parentId: "b" },
    } as unknown as Record<string, NoteDTO>;

    expect(isDescendant("k", "a", notes)).toBe(false);
    expect(isDescendant("a", "k", notes)).toBe(false);

    // we don't care about existence here, that's a self reference
    expect(isDescendant("k", "k", notes)).toBe("CIRCULAR");
  });
});
