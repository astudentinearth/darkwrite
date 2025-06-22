import { Database } from "@darkwrite/common/models";
import { DarkwriteDB, DarkwriteDBType } from "./instance";

export class DatabaseRepository {
  constructor(private _db: DarkwriteDBType = DarkwriteDB) {}

  public async save(database: Database) {
    const tx = (await this._db).transaction("database", "readwrite");
    const store = tx.objectStore("database");
    await store.put(database, database.id);
    await tx.done;
  }

  public async findById(id: string) {
    return await (await this._db).get("database", id);
  }

  public async findAll() {
    const databases = await (await this._db).getAll("database");
    return databases;
  }

  public async deleteById(id: string) {
    const tx = (await this._db).transaction("database", "readwrite");
    const store = tx.objectStore("database");
    await store.delete(id);
    await tx.done;
  }
}
