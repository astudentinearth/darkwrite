import { Workspace } from "@darkwrite/common/models";
import { DarkwriteDBType, DarkwriteDB } from "./instance";

export class WorkspaceRepository{
  constructor(private _db: DarkwriteDBType = DarkwriteDB) {}

  public async save(workspace: Workspace) {
    const tx = (await this._db).transaction("workspace", "readwrite");
    const store = tx.objectStore("workspace");
    await store.put(workspace);
    await tx.done;
  }

  public async findById(id: string) {
    const value = (await this._db).get("workspace", id);
    return value;
  }

  public async findAll() {
    const workspaces = await (await this._db).getAll("workspace");
    return workspaces;
  }

  public async deleteById(id: string) {
    const tx = (await this._db).transaction("workspace", "readwrite");
    const store = tx.objectStore("workspace");
    await store.delete(id);
    await tx.done;
  }
}