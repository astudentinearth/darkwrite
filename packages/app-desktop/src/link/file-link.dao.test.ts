import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createDatabase, type DatabaseType, applySqlMigrations } from "@/db";
import { FileLinkDAO } from "./file-link.dao";
import { linkedFile as linkedFileTable } from "@/db/schema";
import { resolveTx } from "@/db/transactional";
import { ResultAsync } from "neverthrow";

let db: DatabaseType;
const dao = FileLinkDAO(() => resolveTx(db));

describe("FileLinkDAO", () => {
  beforeAll(async () => {
    db = createDatabase();
    db = await applySqlMigrations(db);
  });

  beforeEach(async () => {
    await db.delete(linkedFileTable);
  });

  describe("create", () => {
    it("should create a linked file and return it with a generated id", async () => {
      const result = (
        await dao.create({ filePath: "/home/user/doc.md" })
      )._unsafeUnwrap();

      expect(result.id).toBeDefined();
      expect(result.filePath).toBe("/home/user/doc.md");
    });

    it("should create multiple linked files with unique ids", async () => {
      const [a, b] = (
        await ResultAsync.combine([
          dao.create({ filePath: "/a.md" }),
          dao.create({ filePath: "/b.md" }),
        ])
      )._unsafeUnwrap();

      expect(a.id).not.toBe(b.id);
    });
  });

  describe("findById", () => {
    it("should return the linked file for a known id", async () => {
      const created = (
        await dao.create({ filePath: "/notes/todo.md" })
      )._unsafeUnwrap();

      const result = (await dao.findById(created.id))._unsafeUnwrap();

      expect(result).toBeDefined();
      expect(result?.id).toBe(created.id);
      expect(result?.filePath).toBe("/notes/todo.md");
    });

    it("should return undefined for a non-existent id", async () => {
      const result = (await dao.findById("non-existent-id"))._unsafeUnwrapErr();

      expect(result).toBeDefined();
    });
  });
});
