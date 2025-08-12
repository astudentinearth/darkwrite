import { NoteDTO } from "./dto"
import { resolveUpperTree } from "./note";

test("should resolve the parent tree of a note", ()=>{
  const notes = {
    "a": { id: "a", parentId: null },
    "b": { id: "b", parentId: "a"},
    "c": { id: "c", parentId: null}
  } as unknown as Record<string, NoteDTO>;

  const result = resolveUpperTree("b", notes);
  expect(result.findIndex(n => n.id === "c")).toBe(-1);
  expect(result.findIndex(n => n.id === "b")).toBe(-1);
  expect(result.findIndex(n => n.id === "a")).not.toBe(-1);
})