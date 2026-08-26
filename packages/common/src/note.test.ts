import { nanoid } from "nanoid";
import {
  isDescendant,
  Note,
  NoteProperty,
  PropertyType,
  PropertyUpdater,
  resolveUpperTree,
} from "./note";
import { Rank } from "./rank";

test("should resolve the parent tree of a note", () => {
  const notes = {
    a: { id: "a", parentId: null },
    b: { id: "b", parentId: "a" },
    c: { id: "c", parentId: null },
  } as unknown as Record<string, Note>;

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
    } as unknown as Record<string, Note>;

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
    } as unknown as Record<string, Note>;

    expect(isDescendant("b", "a", notes)).toBe(true);
  });

  it("should return true for indirect descendants", () => {
    const notes = {
      a: { id: "a", parentId: null },
      b: { id: "b", parentId: "a" },
      c: { id: "c", parentId: "b" },
    } as unknown as Record<string, Note>;

    expect(isDescendant("c", "a", notes)).toBe(true);
  });

  it("should correctly handle candidates that don't exist in the data set", () => {
    const notes = {
      a: { id: "a", parentId: null },
      b: { id: "b", parentId: "a" },
      c: { id: "c", parentId: "b" },
    } as unknown as Record<string, Note>;

    expect(isDescendant("k", "a", notes)).toBe(false);
    expect(isDescendant("a", "k", notes)).toBe(false);

    // we don't care about existence here, that's a self reference
    expect(isDescendant("k", "k", notes)).toBe("CIRCULAR");
  });
});

describe("note property tests", () => {
  const testProperties: NoteProperty[] = [
    { type: PropertyType.Text, value: "test" },
    { type: PropertyType.Date, value: new Date().toISOString() },
    { type: PropertyType.Checkbox, value: false },
  ];

  describe("setNoteProperty", () => {
    it.each<NoteProperty>(
      testProperties,
    )("should create a note property on a note that has no properties", (property) => {
      const note = Note._test();
      const name = "New property";
      const result = PropertyUpdater.setNoteProperty(note, name, property);

      expect(result.id).toBe(note.id);
      expect(result.properties[name]).toEqual(property);
      expect(result.propertyOrder).toEqual([name]);
    });

    it.each(
      testProperties,
    )("should create a property on a note with existing properties", (property) => {
      const existingName = "Existing";
      const note = Note._test({
        properties: { [existingName]: property },
        propertyOrder: [existingName],
      });

      const newName = "New property";
      const _new = NoteProperty.default(PropertyType.Text);
      const result = PropertyUpdater.setNoteProperty(note, newName, _new);

      expect(result.id).toBe(note.id);
      expect(result.properties[existingName]).toEqual(property);
      expect(result.properties[newName]).toEqual(_new);
      expect(result.propertyOrder).toEqual([existingName, newName]);
    });

    it.each(
      testProperties,
    )("should update an existing property", (property) => {
      const newProperty = NoteProperty.default(property.type);
      const name = "property";
      const note = Note._test({
        properties: { [name]: property },
        propertyOrder: [name],
      });

      const result = PropertyUpdater.setNoteProperty(note, name, newProperty);

      expect(result.id).toBe(note.id);
      expect(result.properties[name]).toEqual(newProperty);
      expect(result.propertyOrder).toEqual([name]);
    });

    // test reconciliation
    it.each(
      testProperties,
    )("should add to order if property is out of order", (property) => {
      const name = "source";
      const note = Note._test({
        properties: { [name]: property },
        propertyOrder: [],
      });

      const result = PropertyUpdater.setNoteProperty(note, name, property);

      expect(result.id).toBe(note.id);
      expect(result.properties[name]).toEqual(property);
      expect(result.propertyOrder).toEqual([name]);
    });
  });
});
