import { NoteDTO } from "./dto";
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

    expect(isDescendant("a", "d", notes)).toBe(false);
    expect(
      isDescendant("a", "a", notes),
    ).toBe(true);
    expect(
      isDescendant("a", "b", notes),
    ).toBe(true);
    expect(
      isDescendant("a", "c", notes),
    ).toBe(true);


  });
});

