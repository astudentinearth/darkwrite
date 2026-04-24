import { DatabaseType, Transaction } from "@/db";
import {
  LinkedFile,
  NewLinkedFile,
  linkedFile as linkedFileTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export class FileLinkDAO {
  constructor(private db: DatabaseType | Transaction) {}

  async create(link: NewLinkedFile): Promise<LinkedFile> {
    return (await this.db.insert(linkedFileTable).values(link).returning())[0];
  }

  async findById(id: string): Promise<LinkedFile | undefined> {
    return (
      await this.db
        .select()
        .from(linkedFileTable)
        .where(eq(linkedFileTable.id, id))
        .limit(1)
    ).at(0);
  }
}
