import { Note } from "@darkwrite/common/models";
import { DarkwriteDB, DarkwriteDBType } from "./instance";

export class NoteRepository {
  constructor(private _db: DarkwriteDBType = DarkwriteDB) {}

  public async findAll() {
    const notes = await (await this._db).getAll("note");
    return notes;
  }

  public async findById(id: string) {
    const value = (await this._db).get("note", id);
    return value;
  }

  public async save(note: Note) {
    const tx = (await this._db).transaction("note", "readwrite");
    const store = tx.objectStore("note");
    console.log(note);
    await store.put(note);
    await tx.done;
  }

  public async deleteById(id: string) {
    const tx = (await this._db).transaction("note", "readwrite");
    const store = tx.objectStore("note");
    await store.delete(id);
    await tx.done;
  }
}