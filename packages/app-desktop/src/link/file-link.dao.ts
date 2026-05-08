import {
  LinkedFile,
  NewLinkedFile,
  linkedFile as linkedFileTable,
} from "@/db/schema";
import { TransactionalDAO } from "@/db/transactional";
import { eq } from "drizzle-orm";

export class FileLinkDAO extends TransactionalDAO {
  async create(link: NewLinkedFile): Promise<LinkedFile> {
    return (await this.tx.insert(linkedFileTable).values(link).returning())[0];
  }

  async findById(id: string): Promise<LinkedFile | undefined> {
    return (
      await this.tx
        .select()
        .from(linkedFileTable)
        .where(eq(linkedFileTable.id, id))
        .limit(1)
    ).at(0);
  }
}
