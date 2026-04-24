import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createDatabase, DatabaseType, applySqlMigrations } from "@/db";
import { FileLinkDAO } from "./file-link.dao";
import { linkedFile as linkedFileTable } from "@/db/schema";

let db: DatabaseType;
let dao: FileLinkDAO;

describe("FileLinkDAO", () => {
  beforeAll(async () => {
    db = createDatabase();
    db = await applySqlMigrations(db);
    dao = new FileLinkDAO(db);
  });

  beforeEach(async () => {
    await db.delete(linkedFileTable);
  });

  describe("create", () => {
    it("should create a linked file and return it with a generated id", async () => {
      const result = await dao.create({ filePath: "/home/user/doc.md" });

      expect(result.id).toBeDefined();
      expect(result.filePath).toBe("/home/user/doc.md");
    });

    it("should create multiple linked files with unique ids", async () => {
      const a = await dao.create({ filePath: "/a.md" });
      const b = await dao.create({ filePath: "/b.md" });

      expect(a.id).not.toBe(b.id);
    });
  });

  describe("findById", () => {
    it("should return the linked file for a known id", async () => {
      const created = await dao.create({ filePath: "/notes/todo.md" });

      const result = await dao.findById(created.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(created.id);
      expect(result?.filePath).toBe("/notes/todo.md");
    });

    it("should return undefined for a non-existent id", async () => {
      const result = await dao.findById("non-existent-id");

      expect(result).toBeUndefined();
    });
  });
});
