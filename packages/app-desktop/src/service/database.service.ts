import { DatabaseDAO } from "@/database/database.dao";
import { db, type DatabaseType } from "@/db";
import { NotFoundError } from "@darkwrite/common";

export class DatabaseService {
  private databaseDao: DatabaseDAO;

  constructor(
    private _db: DatabaseType = db,
    databaseDao?: DatabaseDAO,
  ) {
    this.databaseDao = databaseDao ?? new DatabaseDAO(this._db);
  }

  async findDatabaseOrThrow(id: string) {
    const result = await this.databaseDao.findById(id);
    if (result == null) {
      throw new NotFoundError("Database", id);
    }
    return result;
  }
}
