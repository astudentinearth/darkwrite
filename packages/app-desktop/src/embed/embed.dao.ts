import { Embed, NewEmbed, PatchEmbed, embed as embedTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isNotUndefined } from "@darkwrite/common";
import { DatabaseType, db, Transaction } from "@/db";

const hasFileSize = (fileSize: number) => eq(embedTable.fileSize, fileSize);

export class EmbedDAO {
  constructor(private tx: DatabaseType | Transaction = db) {}

  async create(embed: NewEmbed) {
    return (await this.tx.insert(embedTable).values(embed).returning())[0];
  }

  async update(embed: PatchEmbed) {
    return (
      await this.tx
        .update(embedTable)
        .set(embed)
        .where(eq(embedTable.id, embed.id))
        .returning()
    ).at(0);
  }

  async updateAll(embeds: PatchEmbed[]): Promise<Embed[]> {
    return (await Promise.all(embeds.map((e) => this.update(e)))).filter(
      isNotUndefined,
    );
  }

  async findById(id: string) {
    return (
      await this.tx
        .select()
        .from(embedTable)
        .where(eq(embedTable.id, id))
        .limit(1)
    ).at(0);
  }

  async findAll() {
    return await this.tx.select().from(embedTable);
  }

  async deleteById(id: string) {
    await this.tx.delete(embedTable).where(eq(embedTable.id, id));
  }

  async delete(embed: Embed) {
    await this.deleteById(embed.id);
  }

  async findAllByFileSize(fileSize: number) {
    return await this.tx.select().from(embedTable).where(hasFileSize(fileSize));
  }
}
