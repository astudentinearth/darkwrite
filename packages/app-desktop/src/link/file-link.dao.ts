import { dbResult } from "@/db/db-result";
import {
  type LinkedFile,
  type NewLinkedFile,
  linkedFile as linkedFileTable,
} from "@/db/schema";
import type { TxResolver } from "@/db/transactional";
import { type DwResultAsync, dwErr } from "@darkwrite/common";
import { eq } from "drizzle-orm";
import { ok } from "neverthrow";

export function FileLinkDAO(tx: TxResolver) {
  function create(link: NewLinkedFile): DwResultAsync<LinkedFile> {
    return dbResult(() =>
      tx().insert(linkedFileTable).values(link).returning().get(),
    );
  }

  function findById(id: string): DwResultAsync<LinkedFile> {
    return dbResult(() =>
      tx()
        .select()
        .from(linkedFileTable)
        .where(eq(linkedFileTable.id, id))
        .get(),
    ).andThen((row) => (row ? ok(row) : dwErr("File link not found.")));
  }

  return {
    create,
    findById,
  };
}
