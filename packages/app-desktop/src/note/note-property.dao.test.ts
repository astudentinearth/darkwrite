import { randomUUID } from "node:crypto";
import { PropertyType } from "@darkwrite/common";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  applySqlMigrations,
  createTestDatabase,
  type DatabaseType,
} from "@/db";
import {
  type NewNote,
  type NewPropertyDefRow,
  propertyDefinition as propertyDefinitionTable,
  type Workspace,
} from "@/db/schema";
import { resolveTx } from "@/db/transactional";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import { NoteDAO } from "./note.dao";
import { NotePropertyDAO } from "./note-property.dao";

const db: DatabaseType = createTestDatabase();

describe("NotePropertyDAO", () => {
  let workspaceId = "";
  let databaseNoteId = "";

  const noteDao = NoteDAO(() => resolveTx(db));
  const propDao = NotePropertyDAO(() => resolveTx(db));

  const createDatabaseNote = async (): Promise<string> => {
    const newNote: NewNote = {
      title: "Test Database Note",
      workspaceId,
      favoriteOrderHint: "",
      createdAt: new Date(),
      modifiedAt: new Date(),
      type: "database",
    };
    const note = (await noteDao.create(newNote))._unsafeUnwrap();
    return note.id;
  };

  beforeAll(async () => {
    await applySqlMigrations(db);

    const workspace: Workspace = (
      await WorkspaceDAO(() => resolveTx(db)).create({
        name: "Test Workspace",
        createdAt: new Date(),
      })
    )._unsafeUnwrap();

    workspaceId = workspace.id;
    databaseNoteId = await createDatabaseNote();
  });

  beforeEach(async () => {
    await db.delete(propertyDefinitionTable);
  });

  describe("getDatabaseSchema", () => {
    it("should return an empty object when the database has no properties", async () => {
      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema).toEqual({});
    });

    it("should return properties keyed by their id", async () => {
      const column: NewPropertyDefRow = {
        name: "Status",
        type: PropertyType.Select,
        databaseId: databaseNoteId,
      };
      const inserted = (
        await propDao.addDatabaseColumn(column)
      )._unsafeUnwrap();
      const insertedProp = inserted[0];

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema[insertedProp.id]).toBeDefined();
      expect(schema[insertedProp.id].name).toBe(column.name);
      expect(schema[insertedProp.id].type).toBe(column.type);
    });

    it("should return all properties for the given database", async () => {
      const columnA: NewPropertyDefRow = {
        name: "Title",
        type: "text",
        databaseId: databaseNoteId,
      };
      const columnB: NewPropertyDefRow = {
        name: "Done",
        type: "checkbox",
        databaseId: databaseNoteId,
      };

      const propA = (
        await propDao.addDatabaseColumn(columnA)
      )._unsafeUnwrap()[0];
      const propB = (
        await propDao.addDatabaseColumn(columnB)
      )._unsafeUnwrap()[0];

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(Object.keys(schema)).toHaveLength(2);
      expect(schema[propA.id]).toBeDefined();
      expect(schema[propB.id]).toBeDefined();
    });

    it("should not return properties belonging to a different database", async () => {
      const otherDatabaseNoteId = await createDatabaseNote();

      const columnForOther: NewPropertyDefRow = {
        name: "Category",
        type: PropertyType.Select,
        databaseId: otherDatabaseNoteId,
      };
      await propDao.addDatabaseColumn(columnForOther);

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(Object.keys(schema)).toHaveLength(0);
    });

    it("should return properties only for the requested database when multiple databases exist", async () => {
      const otherDatabaseNoteId = await createDatabaseNote();

      const columnForTarget: NewPropertyDefRow = {
        name: "Priority",
        type: PropertyType.Select,
        databaseId: databaseNoteId,
      };
      const columnForOther: NewPropertyDefRow = {
        name: "Due Date",
        type: PropertyType.Date,
        databaseId: otherDatabaseNoteId,
      };

      const targetProp = (
        await propDao.addDatabaseColumn(columnForTarget)
      )._unsafeUnwrap()[0];
      const otherProp = (
        await propDao.addDatabaseColumn(columnForOther)
      )._unsafeUnwrap()[0];

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema[targetProp.id]).toBeDefined();
      expect(schema[otherProp.id]).toBeUndefined();
    });
  });

  describe("addDatabaseColumn", () => {
    it("should insert a new property and return it", async () => {
      const column: NewPropertyDefRow = {
        name: "Tags",
        type: PropertyType.MultiSelect,
        databaseId: databaseNoteId,
      };

      const result = (await propDao.addDatabaseColumn(column))._unsafeUnwrap();

      expect(result).toHaveLength(1);
      const inserted = result[0];
      expect(inserted.name).toBe(column.name);
      expect(inserted.type).toBe(column.type);
      expect(inserted.databaseId).toBe(column.databaseId);
      expect(inserted.id).toBeDefined();
    });

    it("should generate a unique id for each inserted property", async () => {
      const columnA: NewPropertyDefRow = {
        name: "Field A",
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };
      const columnB: NewPropertyDefRow = {
        name: "Field B",
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };

      const propA = (
        await propDao.addDatabaseColumn(columnA)
      )._unsafeUnwrap()[0];
      const propB = (
        await propDao.addDatabaseColumn(columnB)
      )._unsafeUnwrap()[0];

      expect(propA.id).not.toBe(propB.id);
    });

    it("should default name to empty string when not provided", async () => {
      const column: NewPropertyDefRow = {
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };

      const result = (await propDao.addDatabaseColumn(column))._unsafeUnwrap();

      expect(result[0].name).toBe("");
    });

    it("should default type to text when not provided", async () => {
      const column: NewPropertyDefRow = {
        name: "Unnamed",
        databaseId: databaseNoteId,
      };

      const result = (await propDao.addDatabaseColumn(column))._unsafeUnwrap();

      expect(result[0].type).toBe("text");
    });

    it("should store the config field", async () => {
      const config = { options: ["A", "B", "C"] };
      const column: NewPropertyDefRow = {
        name: "Select Field",
        type: PropertyType.Select,
        config,
        databaseId: databaseNoteId,
      };

      const result = (await propDao.addDatabaseColumn(column))._unsafeUnwrap();

      expect(result[0].config).toEqual(config);
    });

    it("should err when inserting a property for a non-existent database note", async () => {
      const column: NewPropertyDefRow = {
        name: "Ghost Field",
        type: PropertyType.Text,
        databaseId: randomUUID(),
      };

      const result = await propDao.addDatabaseColumn(column);

      expect(result.isErr()).toBe(true);
    });
  });

  describe("updateDatabaseColumn", () => {
    it("should update the name of an existing property", async () => {
      const column: NewPropertyDefRow = {
        name: "Old Name",
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };
      const inserted = (
        await propDao.addDatabaseColumn(column)
      )._unsafeUnwrap()[0];

      const newName = "New Name";
      await propDao.updateDatabaseColumn(inserted.id, { name: newName });

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema[inserted.id].name).toBe(newName);
    });

    it("should update the type of an existing property", async () => {
      const column: NewPropertyDefRow = {
        name: "Flexible Field",
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };
      const inserted = (
        await propDao.addDatabaseColumn(column)
      )._unsafeUnwrap()[0];

      const newType = "checkbox";
      await propDao.updateDatabaseColumn(inserted.id, { type: newType });

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema[inserted.id].type).toBe(newType);
    });

    it("should update the config of an existing property", async () => {
      const column: NewPropertyDefRow = {
        name: "Configurable",
        type: PropertyType.Select,
        config: { options: ["X"] },
        databaseId: databaseNoteId,
      };
      const inserted = (
        await propDao.addDatabaseColumn(column)
      )._unsafeUnwrap()[0];

      const newConfig = { options: ["X", "Y", "Z"] };
      await propDao.updateDatabaseColumn(inserted.id, { config: newConfig });

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema[inserted.id].config).toEqual(newConfig);
    });

    it("should update multiple fields at once", async () => {
      const column: NewPropertyDefRow = {
        name: "Initial Name",
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };
      const inserted = (
        await propDao.addDatabaseColumn(column)
      )._unsafeUnwrap()[0];

      const patch = { name: "Updated Name", type: PropertyType.Date };
      await propDao.updateDatabaseColumn(inserted.id, patch);

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema[inserted.id].name).toBe(patch.name);
      expect(schema[inserted.id].type).toBe(patch.type);
    });

    it("should not affect other properties when updating one", async () => {
      const columnA: NewPropertyDefRow = {
        name: "Field A",
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };
      const columnB: NewPropertyDefRow = {
        name: "Field B",
        type: PropertyType.Checkbox,
        databaseId: databaseNoteId,
      };

      const propA = (
        await propDao.addDatabaseColumn(columnA)
      )._unsafeUnwrap()[0];
      const propB = (
        await propDao.addDatabaseColumn(columnB)
      )._unsafeUnwrap()[0];

      await propDao.updateDatabaseColumn(propA.id, { name: "Field A Updated" });

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema[propB.id].name).toBe(columnB.name);
      expect(schema[propB.id].type).toBe(columnB.type);
    });

    it("should not err when updating a non-existent property id", async () => {
      const result = await propDao.updateDatabaseColumn(randomUUID(), {
        name: "Phantom Update",
      });

      expect(result.isOk()).toBe(true);
    });
  });

  describe("dropDatabaseColumn", () => {
    it("should remove the column from the schema", async () => {
      const column: NewPropertyDefRow = {
        name: "To Be Deleted",
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };
      const inserted = (
        await propDao.addDatabaseColumn(column)
      )._unsafeUnwrap()[0];

      await propDao.dropDatabaseColumn(inserted.id);

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema[inserted.id]).toBeUndefined();
    });

    it("should return Ok", async () => {
      const column: NewPropertyDefRow = {
        name: "Droppable",
        type: PropertyType.Checkbox,
        databaseId: databaseNoteId,
      };
      const inserted = (
        await propDao.addDatabaseColumn(column)
      )._unsafeUnwrap()[0];

      const result = await propDao.dropDatabaseColumn(inserted.id);

      expect(result.isOk()).toBe(true);
    });

    it("should not affect other columns in the same database", async () => {
      const columnA: NewPropertyDefRow = {
        name: "Keep Me",
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };
      const columnB: NewPropertyDefRow = {
        name: "Delete Me",
        type: PropertyType.Select,
        databaseId: databaseNoteId,
      };

      const propA = (
        await propDao.addDatabaseColumn(columnA)
      )._unsafeUnwrap()[0];
      const propB = (
        await propDao.addDatabaseColumn(columnB)
      )._unsafeUnwrap()[0];

      await propDao.dropDatabaseColumn(propB.id);

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(schema[propA.id]).toBeDefined();
      expect(schema[propA.id].name).toBe(columnA.name);
      expect(schema[propB.id]).toBeUndefined();
    });

    it("should not affect columns belonging to a different database", async () => {
      const otherDatabaseNoteId = await createDatabaseNote();

      const columnInOther: NewPropertyDefRow = {
        name: "Other DB Column",
        type: PropertyType.Date,
        databaseId: otherDatabaseNoteId,
      };
      const columnInTarget: NewPropertyDefRow = {
        name: "Target DB Column",
        type: PropertyType.Text,
        databaseId: databaseNoteId,
      };

      const otherProp = (
        await propDao.addDatabaseColumn(columnInOther)
      )._unsafeUnwrap()[0];
      const targetProp = (
        await propDao.addDatabaseColumn(columnInTarget)
      )._unsafeUnwrap()[0];

      await propDao.dropDatabaseColumn(targetProp.id);

      const otherSchema = (
        await propDao.getDatabaseSchema(otherDatabaseNoteId)
      )._unsafeUnwrap();

      expect(otherSchema[otherProp.id]).toBeDefined();
    });

    it("should be a no-op when given a non-existent column id", async () => {
      const result = await propDao.dropDatabaseColumn(randomUUID());

      expect(result.isOk()).toBe(true);
    });

    it("should remove all data when the only column is dropped", async () => {
      const column: NewPropertyDefRow = {
        name: "Only Column",
        type: PropertyType.MultiSelect,
        databaseId: databaseNoteId,
      };
      const inserted = (
        await propDao.addDatabaseColumn(column)
      )._unsafeUnwrap()[0];

      await propDao.dropDatabaseColumn(inserted.id);

      const schema = (
        await propDao.getDatabaseSchema(databaseNoteId)
      )._unsafeUnwrap();

      expect(Object.keys(schema)).toHaveLength(0);
    });
  });
});
