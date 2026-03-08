import { NotFoundError } from "@darkwrite/common/error";
import { DatabaseRepository } from "../repository/database.repository";

export class DatabaseService {
  constructor(private databaseRepository = new DatabaseRepository()) {}

  async findDatabaseOrThrow(id: string) {
    const result = await this.databaseRepository.findById(id);
    if (result == null) {
      throw new NotFoundError("Database", id);
    }
    return result;
  }
}
