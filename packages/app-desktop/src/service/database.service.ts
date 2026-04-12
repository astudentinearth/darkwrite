import { DatabaseDAO } from "@/database/database.dao";
import { DatabaseType, db } from "@/db";
import { NotFoundError } from "@darkwrite/common";

export class DatabaseService {
  private databaseDao: DatabaseDAO;

  constructor(
    private db: DatabaseType = db,
    databaseDao?: DatabaseDAO,
  ) {
    this.databaseDao = databaseDao ?? new DatabaseDAO(this.db);
  }

  async findDatabaseOrThrow(id: string) {
    const result = await this.databaseDao.findById(id);
    if (result == null) {
      throw new NotFoundError("Database", id);
    }
    return result;
  }
}
