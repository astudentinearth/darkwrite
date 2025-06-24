import { DarkwriteDB, DarkwriteDBType } from "./instance";

export class DocumentRepository{
  constructor(private _db: DarkwriteDBType = DarkwriteDB) {}
  
  public async saveById(id: string, value: string) {
    const tx = (await this._db).transaction("note-content", "readwrite");
    const store = tx.objectStore("note-content");
    await store.put(value, id);
  }

  public async findById(id: string) {
    return (await this._db).get("note-content", id);
  }

  public async deleteById(id: string){
    const tx = (await this._db).transaction("note-content", "readwrite");
    const store = tx.objectStore("note-content");
    await store.delete(id);
    await tx.done;
  }

}