
import fse from "fs/promises";
import { join } from "path";
import { Paths } from "./paths";
import { rmIfExists } from "./fs";
import { pathToFileURL } from "url";

export interface IEmbedStore {
  put: (fileName: string, buf: Buffer) => Promise<void>;
  get: (fileName: string) => Promise<Buffer>;
  getUrl: (fileName: string) => Promise<URL>;
  delete: (fileName: string) => Promise<void>;
}

export class EmbedFileStore implements IEmbedStore {
  private getBlobPath(fileName: string) {
    return join(Paths.EMBED_DIR, fileName);
  }

  async put(fileName: string, buf: Buffer) {
    await fse.writeFile(this.getBlobPath(fileName), buf);
  }

  async get(fileName: string) {
    return await fse.readFile(this.getBlobPath(fileName));
  }

  async delete(fileName: string) {
    await rmIfExists(this.getBlobPath(fileName));
  }

  async getUrl(fileName: string) {
    return pathToFileURL(this.getBlobPath(fileName));
  }
}
