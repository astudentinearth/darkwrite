import { dbResult } from "@/db/db-result";
import { Embed, NewEmbed, PatchEmbed, embed as embedTable } from "@/db/schema";
import { TxResolver } from "@/db/transactional";
import { DwResultAsync, dwErr } from "@darkwrite/common";
import { eq } from "drizzle-orm";
import { ok } from "neverthrow";

const hasFileSize = (fileSize: number) => eq(embedTable.fileSize, fileSize);

export function EmbedDAO(tx: TxResolver) {
  function create(embed: NewEmbed): DwResultAsync<Embed> {
    return dbResult(() =>
      tx().insert(embedTable).values(embed).returning().get(),
    );
  }

  function update(embed: PatchEmbed): DwResultAsync<Embed> {
    return dbResult(() =>
      tx()
        .update(embedTable)
        .set(embed)
        .where(eq(embedTable.id, embed.id))
        .returning(),
    ).andThen((rows) =>
      rows.at(0)
        ? ok(rows[0])
        : dwErr("Embed not found")
      );
  }

  function findById(id: string): DwResultAsync<Embed> {
    return dbResult(() =>
      tx().select().from(embedTable).where(eq(embedTable.id, id)).get(),
    ).andThen((row) =>
      row ? ok(row) : dwErr("Embed not found.") 
    );
  }

  function findAll(): DwResultAsync<Embed[]> {
    return dbResult(() => tx().select().from(embedTable));
  }

  function deleteById(id: string): DwResultAsync<void> {
    return dbResult(() =>
      tx().delete(embedTable).where(eq(embedTable.id, id)),
    ).andThen(() => ok());
  }

  function deleteEmbed(embed: Embed): DwResultAsync<void> {
    return deleteById(embed.id);
  }

  function findAllByFileSize(fileSize: number): DwResultAsync<Embed[]> {
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
