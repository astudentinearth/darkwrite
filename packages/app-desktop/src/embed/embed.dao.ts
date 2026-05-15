import { dbResult } from "@/db/db-result";
import { Embed, NewEmbed, PatchEmbed, embed as embedTable } from "@/db/schema";
import { DbError, TxResolver } from "@/db/transactional";
import { EmbedError } from "@darkwrite/common";
import { eq } from "drizzle-orm";
import { ResultAsync, err, ok } from "neverthrow";

const hasFileSize = (fileSize: number) => eq(embedTable.fileSize, fileSize);

type EmbedDaoResult<T> = ResultAsync<T, EmbedError | DbError>;

export function EmbedDAO(tx: TxResolver) {
  function create(embed: NewEmbed): EmbedDaoResult<Embed> {
    return dbResult(() =>
      tx().insert(embedTable).values(embed).returning().get(),
    );
  }

  function update(embed: PatchEmbed): EmbedDaoResult<Embed> {
    return dbResult(() =>
      tx()
        .update(embedTable)
        .set(embed)
        .where(eq(embedTable.id, embed.id))
        .returning(),
    ).andThen((rows) =>
      rows.at(0)
        ? ok(rows[0])
        : err({ type: "embed-not-found", id: embed.id } satisfies EmbedError),
    );
  }

  function findById(id: string): EmbedDaoResult<Embed> {
    return dbResult(() =>
      tx().select().from(embedTable).where(eq(embedTable.id, id)).get(),
    ).andThen((row) =>
      row ? ok(row) : err({ type: "embed-not-found", id } satisfies EmbedError),
    );
  }

  function findAll(): EmbedDaoResult<Embed[]> {
    return dbResult(() => tx().select().from(embedTable));
  }

  function deleteById(id: string): EmbedDaoResult<void> {
    return dbResult(() =>
      tx().delete(embedTable).where(eq(embedTable.id, id)),
    ).andThen(() => ok());
  }

  function deleteEmbed(embed: Embed): EmbedDaoResult<void> {
    return deleteById(embed.id);
  }

  function findAllByFileSize(fileSize: number): EmbedDaoResult<Embed[]> {
    return dbResult(() =>
      tx().select().from(embedTable).where(hasFileSize(fileSize)),
    );
  }

  return {
    create,
    update,
    findById,
    findAll,
    findAllByFileSize,
    delete: deleteEmbed,
    deleteById,
  };
}
