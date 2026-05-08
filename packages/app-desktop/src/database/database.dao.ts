import { Transaction } from "@/db";
import {
  Database,
  database as databaseTable,
  NewDatabase,
  PatchDatabase,
} from "@/db/schema";
import { TransactionalDAO } from "@/db/transactional";
import { isNotUndefined, NotFoundError } from "@darkwrite/common";
import { eq } from "drizzle-orm";

export class DatabaseDAO extends TransactionalDAO {
  /** @deprecated */
  static transactional(tx: Transaction) {
    return new DatabaseDAO(tx);
  }

  /** @deprecated */
  transactional(tx: Transaction) {
    return DatabaseDAO.transactional(tx);
  }

  async create(database: NewDatabase) {
    return (
      await this.tx.insert(databaseTable).values(database).returning()
    )[0];
  }

  async update(database: PatchDatabase) {
    return (
      await this.tx
        .update(databaseTable)
        .set(database)
        .where(eq(databaseTable.id, database.id))
        .returning()
    ).at(0);
  }

  async updateAll(databases: PatchDatabase[]) {
    return (await Promise.all(databases.map((d) => this.update(d)))).filter(
      isNotUndefined,
    );
  }

  async findById(id: string) {
    return (
      await this.tx
        .select()
        .from(databaseTable)
        .where(eq(databaseTable.id, id))
        .limit(1)
    ).at(0);
  }

  async findByIdOrThrow(id: string) {
    const result = await this.findById(id);
    if (!result) throw new NotFoundError("Database", id);
    return result;
  }

  async findAll() {
    return await this.tx.select().from(databaseTable);
  }

  async deleteById(id: string) {
    await this.tx.delete(databaseTable).where(eq(databaseTable.id, id));
  }

  async delete(database: Database) {
    await this.deleteById(database.id);
  }
}
