import { DarkwriteDB, DarkwriteDBType } from "./instance";


export class EmbedFileRepository {
  constructor(private _db: DarkwriteDBType = DarkwriteDB) {}
  public async saveById(id: string ,file: Blob) {
    const tx = (await this._db).transaction("embed-file", "readwrite");
    const store = tx.objectStore("embed-file");
    await store.put(file, id);
    await tx.done;
  }

  public async findById(id: string) {
    return (await this._db).get("embed-file", id);
  }
  public async deleteById(id: string) {
    const tx = (await this._db).transaction("embed-file", "readwrite");
    const store = tx.objectStore("embed-file");
    await store.delete(id);
    await tx.done;
  }
  public async findAll() {
    const files = await (await this._db).getAll("embed-file");
    return files;
  }
}