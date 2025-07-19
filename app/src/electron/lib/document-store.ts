import { writeFile, readFile } from "fs/promises"
import { exists } from "fs-extra";
import { getNotePath } from "./paths";

export interface IDocumentStore {
  create: (noteId: string) => Promise<void>;
  write: (noteId: string, content: string) => Promise<void>;
  read: (noteId: string) => Promise<string>;
  exists: (noteId: string) => Promise<boolean>;
}

export class DocumentFileStore implements IDocumentStore {
  constructor() {}
  async create(noteId: string) {
    await writeFile(getNotePath(noteId), "{}");
  }

  async write(noteId: string, content: string) {
    await writeFile(getNotePath(noteId), content);
  }

  async read(noteId: string) {
    return await readFile(getNotePath(noteId), "utf-8");
  }

  async exists(noteId: string) {
    return await exists(getNotePath(noteId));
  }
}
