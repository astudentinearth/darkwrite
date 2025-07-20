
import fse from "fs/promises";
import { join } from "path";
import { Paths } from "./paths";
import { rmIfExists } from "./fs";
import { pathToFileURL } from "url";

export interface IBlobStore {
  put: (id: string, buf: Buffer) => Promise<void>;
  get: (id: string) => Promise<Buffer>;
  getUrl: (id: string) => Promise<URL>;
  delete: (id: string) => Promise<void>;
}

export class BlobFileStore implements IBlobStore {
  private getBlobPath(id: string) {
    return join(Paths.EMBED_DIR, id);
  }

  async put(id: string, buf: Buffer) {
    await fse.writeFile(this.getBlobPath(id), buf);
  }

  async get(id: string) {
    return await fse.readFile(this.getBlobPath(id));
  }

  async delete(id: string) {
    await rmIfExists(this.getBlobPath(id));
  }

  async getUrl(id: string) {
    return pathToFileURL(this.getBlobPath(id));
  }
}
