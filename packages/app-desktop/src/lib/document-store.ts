import { exists } from "fs-extra";
import { readFile, writeFile, rm } from "fs/promises";
import path from "node:path";
import * as fslib from "@/lib/fs";
import { IllegalArgumentError } from "@darkwrite/common";

export interface IDocumentStore {
  create: (id: string) => Promise<void>;
  write: (id: string, content: string) => Promise<void>;
  read: (id: string) => Promise<string>;
  exists: (id: string) => Promise<boolean>;
  ls: () => Promise<string[]>;
  delete: (id: string) => Promise<void>;
}

/** Make a directory act as a JSON document store.
 *  All documents will follow <id>.json file name convention.
 */
export class DocumentFileStore implements IDocumentStore {
  /** @param directory Directory to store documents in */
  constructor(private directory: string) {}

  private getPath(id: string) {
    if (id.includes("/") || id.includes("\\"))
      throw new IllegalArgumentError(
        "Invalid path passed into document store.",
      );
    return path.join(this.directory, `${id}.json`);
  }

  async create(id: string) {
    await writeFile(this.getPath(id), "{}");
  }

  async write(id: string, content: string) {
    await writeFile(this.getPath(id), content);
  }

  async read(id: string) {
    return await readFile(this.getPath(id), "utf-8");
  }

  async exists(id: string) {
    return await exists(this.getPath(id));
  }

  async ls() {
    const files = await fslib.ls(this.directory);
    // only keep .json files and strip the .json extension
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    return jsonFiles.map((f) => f.substring(0, f.length - 5));
  }

  async delete(id: string) {
    // use force option to avoid throwing if the database record was orphaned
    rm(this.getPath(id), { force: true });
  }
}
