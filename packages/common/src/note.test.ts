import { nanoid } from "nanoid";
import {
  isDescendant,
  Note,
  NoteProperty,
  type PropertyDiff,
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

  describe("renameNoteProperty", () => {
    it.each(testProperties)("should rename a property", (property) => {
      const src = "src";
      const dest = "dest";

      const note = Note._test({
        properties: { [src]: property },
        propertyOrder: [src],
      });

      const result = PropertyUpdater.renameNoteProperty(
        note,
        src,
        dest,
      )._unsafeUnwrap();

      expect(result).toStrictEqual<PropertyDiff>({
        id: note.id,
        propertyOrder: [dest],
        properties: { [dest]: property },
      });

      expect(result.properties).not.toHaveProperty(src);
    });

    it("should err on non-existent properties", () => {
      const note = Note._test(); // no props
      const result = PropertyUpdater.renameNoteProperty(note, "a", "b");

      expect(result.isErr()).toBe(true);
    });

    it("should err when the new name already exists", () => {
      const note = Note._test({
        properties: {
          a: NoteProperty.default(PropertyType.Text),
          b: NoteProperty.default(PropertyType.Checkbox),
        },
        propertyOrder: ["a", "b"],
      });

      const result = PropertyUpdater.renameNoteProperty(note, "b", "a");
      expect(result.isErr()).toBe(true);
    });

    it("should rename correctly when multiple props are present", () => {
      const prop1 = "prop1";
      const src = "src";
      const dest = "dest";

      const note = Note._test({
        propertyOrder: [prop1, src],
        properties: {
          [prop1]: NoteProperty.default(PropertyType.Text),
          [src]: NoteProperty.default(PropertyType.Text),
        },
      });

      const result = PropertyUpdater.renameNoteProperty(
        note,
        src,
        dest,
      )._unsafeUnwrap();
      expect(result).toStrictEqual<PropertyDiff>({
        id: note.id,
        properties: {
          [prop1]: note.properties[prop1],
          [dest]: note.properties[src],
        },
        propertyOrder: [prop1, dest],
      });
    });
  });

  describe("deleteNoteProperty", () => {
    it("deletes a property", () => {
      const name = "property";
      const note = Note._test({
        properties: { [name]: NoteProperty.default(PropertyType.Text) },
        propertyOrder: [name],
      });

      const result = PropertyUpdater.deleteNoteProperty(
        note,
        name,
      )._unsafeUnwrap();
      expect(result).toStrictEqual<PropertyDiff>({
        id: note.id,
        propertyOrder: [],
        properties: {},
      });
    });

    it("errs on missing property", () => {
      const result = PropertyUpdater.deleteNoteProperty(Note._test(), "67");

      expect(result.isErr()).toBe(true);
    });

    it("doesnt touch other properties", () => {
      const props = {
        a: NoteProperty.default(PropertyType.Text),
        b: NoteProperty.default(PropertyType.Text),
      };

      const note = Note._test({ properties: props, propertyOrder: ["a", "b"] });
      const result = PropertyUpdater.deleteNoteProperty(
        note,
        "a",
      )._unsafeUnwrap();
      expect(result).toStrictEqual<PropertyDiff>({
        id: note.id,
        propertyOrder: ["b"],
        properties: { b: props.b },
      });
    });
  });

  describe("reorderNoteProperty", () => {
    it.each([
      { src: "c", dest: "a", expected: ["c", "a", "b"] },
      { src: "a", dest: "c", expected: ["b", "a", "c"] },
      { src: "b", dest: "c", expected: ["a", "b", "c"] },
    ])("should move before a property", ({ src, dest, expected }) => {
      const note = Note._test({
        propertyOrder: ["a", "b", "c"],
        properties: {
          a: NoteProperty.default(PropertyType.Text),
          b: NoteProperty.default(PropertyType.Text),
          c: NoteProperty.default(PropertyType.Text),
        },
      });

      const diff = PropertyUpdater.reorderNoteProperty(
        note,
        src,
        dest,
        "before",
      )._unsafeUnwrap();

      expect(diff.propertyOrder).toEqual(expected);
    });

    it.each([
      { src: "c", dest: "a", expected: ["a", "c", "b"] },
      { src: "a", dest: "c", expected: ["b", "c", "a"] },
      { src: "b", dest: "c", expected: ["a", "c", "b"] },
    ])("should move after a property", ({ src, dest, expected }) => {
      const note = Note._test({
        propertyOrder: ["a", "b", "c"],
        properties: {
          a: NoteProperty.default(PropertyType.Text),
          b: NoteProperty.default(PropertyType.Text),
          c: NoteProperty.default(PropertyType.Text),
        },
      });

      const diff = PropertyUpdater.reorderNoteProperty(
        note,
        src,
        dest,
        "after",
      )._unsafeUnwrap();

      expect(diff.propertyOrder).toEqual(expected);
    });

    it("should err when source = dest", () => {
      const note = Note._test({
        propertyOrder: ["a", "b", "c"],
        properties: {
          a: NoteProperty.default(PropertyType.Text),
          b: NoteProperty.default(PropertyType.Text),
          c: NoteProperty.default(PropertyType.Text),
        },
      });

      const result = PropertyUpdater.reorderNoteProperty(
        note,
        "a",
        "a",
        "after",
      );

      expect(result.isErr()).toBe(true);
    });

    it("should reconcile when source doesn't exist in order", () => {
      const note = Note._test({
        propertyOrder: ["a", "b", "c"],
        properties: {
          a: NoteProperty.default(PropertyType.Text),
          b: NoteProperty.default(PropertyType.Text),
          c: NoteProperty.default(PropertyType.Text),
          d: NoteProperty.default(PropertyType.Text),
        },
      });

      const result = PropertyUpdater.reorderNoteProperty(
        note,
        "d",
        "a",
        "after",
      )._unsafeUnwrap();

      expect(result.propertyOrder).toEqual(["a", "d", "b", "c"]);
    });

    it("should err when source doesn't exist in properties", () => {
      const note = Note._test({
        propertyOrder: ["a", "b", "c", "d"],
        properties: {
          a: NoteProperty.default(PropertyType.Text),
          b: NoteProperty.default(PropertyType.Text),
          c: NoteProperty.default(PropertyType.Text),
        },
      });

      const result = PropertyUpdater.reorderNoteProperty(
        note,
        "d",
        "a",
        "after",
      );
      expect(result.isErr()).toBe(true);
    });

    it("should reconcile when dest doesn't exist in order", () => {
      const note = Note._test({
        propertyOrder: ["a", "b", "c"],
        properties: {
          a: NoteProperty.default(PropertyType.Text),
          b: NoteProperty.default(PropertyType.Text),
          c: NoteProperty.default(PropertyType.Text),
          d: NoteProperty.default(PropertyType.Text),
        },
      });

      const result = PropertyUpdater.reorderNoteProperty(
        note,
        "a",
        "d",
        "after",
      )._unsafeUnwrap();

      expect(result.propertyOrder).toEqual(["b", "c", "d", "a"]);
    });

    it("should err when dest doesn't exist in properties", () => {
      const note = Note._test({
        propertyOrder: ["a", "b", "c", "d"],
        properties: {
          a: NoteProperty.default(PropertyType.Text),
          b: NoteProperty.default(PropertyType.Text),
          c: NoteProperty.default(PropertyType.Text),
        },
      });

      const result = PropertyUpdater.reorderNoteProperty(
        note,
        "a",
        "d",
        "after",
      );
      expect(result.isErr()).toBe(true);
    });
  });
});
