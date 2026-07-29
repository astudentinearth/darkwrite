import { type DwResultAsync, dwErr } from "@darkwrite/common";
import { eq } from "drizzle-orm";
import { ok } from "neverthrow";
import { dbResult } from "@/db/db-result";
import {
  type EmbedRow,
  embed as embedTable,
  type NewEmbedRow,
  type PatchEmbedRow,
} from "@/db/schema";
import type { TxResolver } from "@/db/transactional";

const hasFileSize = (fileSize: number) => eq(embedTable.fileSize, fileSize);

export function EmbedDAO(tx: TxResolver) {
  function create(embed: NewEmbedRow): DwResultAsync<EmbedRow> {
    return dbResult(() =>
      tx().insert(embedTable).values(embed).returning().get(),
    );
  }

  function update(embed: PatchEmbedRow): DwResultAsync<EmbedRow> {
    return dbResult(() =>
      tx()
        .update(embedTable)
        .set(embed)
        .where(eq(embedTable.id, embed.id))
        .returning(),
    ).andThen((rows) => (rows.at(0) ? ok(rows[0]) : dwErr("Embed not found")));
  }

  function findById(id: string): DwResultAsync<EmbedRow> {
    return dbResult(() =>
      tx().select().from(embedTable).where(eq(embedTable.id, id)).get(),
    ).andThen((row) => (row ? ok(row) : dwErr("Embed not found.")));
  }

  function findAllByFileSize(fileSize: number): DwResultAsync<EmbedRow[]> {
    return dbResult(() =>
      tx().select().from(embedTable).where(hasFileSize(fileSize)),
    );
  }

  return {
    create,
    update,
    findById,
    findAllByFileSize,
  };
}
