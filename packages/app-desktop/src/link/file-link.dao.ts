import { dbResult } from "@/db/db-result";
import {
  LinkedFile,
  NewLinkedFile,
  linkedFile as linkedFileTable,
} from "@/db/schema";
import { DbError, TxResolver } from "@/db/transactional";
import { FileLinkError } from "@darkwrite/common";
import { eq } from "drizzle-orm";
import { ResultAsync, ok, err } from "neverthrow";

type FileLinkDaoResult<T> = ResultAsync<T, FileLinkError | DbError>;

export function FileLinkDAO(tx: TxResolver) {
  function create(link: NewLinkedFile): FileLinkDaoResult<LinkedFile> {
    return dbResult(() =>
      tx().insert(linkedFileTable).values(link).returning().get(),
    );
  }

  function findById(id: string): FileLinkDaoResult<LinkedFile> {
    return dbResult(() =>
      tx()
        .select()
        .from(linkedFileTable)
        .where(eq(linkedFileTable.id, id))
        .get(),
    ).andThen((row) =>
      row
        ? ok(row)
        : err({ type: "file-link-not-found", id } satisfies FileLinkError),
    );
  }

  return {
    create,
    findById,
  };
}
