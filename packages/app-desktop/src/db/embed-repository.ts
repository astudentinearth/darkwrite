
import { Embed } from "@darkwrite/common/models";
import { DarkwriteDB, DarkwriteDBType } from "./instance";

export class EmbedRepository{
  constructor(private _db: DarkwriteDBType = DarkwriteDB) {}

  public async save(embed: Embed) {
    const tx = (await this._db).transaction("embed", "readwrite");
    const embedStore = tx.objectStore("embed");
    await embedStore.put(embed, embed.id);
    await tx.done;
  }

  public async findById(id: string) {
    return (await (this._db)).get("embed", id);
  }

  public async deleteById(id: string) {
    const tx = (await this._db).transaction("embed", "readwrite");
    const embedStore = tx.objectStore("embed");
    await embedStore.delete(id);
    await tx.done;
  }

}