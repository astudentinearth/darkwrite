import * as fslib from "@/lib/fs";
import { pathExists } from "fs-extra";
import { readFile, rm, writeFile } from "fs/promises";
import { err, ok, Result, ResultAsync } from "neverthrow";
import path from "node:path";

export type DocumentStoreErr = { type: "path-error" } | fslib.FsError;

export interface IDocumentStore {
  create: (id: string) => ResultAsync<void, DocumentStoreErr>;
  write: (id: string, content: string) => ResultAsync<void, DocumentStoreErr>;
  read: (id: string) => ResultAsync<string, DocumentStoreErr>;
  exists: (id: string) => ResultAsync<boolean, DocumentStoreErr>;
  ls: () => ResultAsync<string[], DocumentStoreErr>;
  delete: (id: string) => ResultAsync<void, DocumentStoreErr>;
}

/** Make a directory act as a JSON document store.
 *  All documents will follow <id>.json file name convention.
 * @param directory Directory to store documents in
 */
export function DocumentFileStore(directory: string): IDocumentStore {
  /**  */

  function getPath(id: string): Result<string, DocumentStoreErr> {
    if (id.includes("/") || id.includes("\\"))
      return err({ type: "path-error" } satisfies DocumentStoreErr);
    return ok(path.join(directory, `${id}.json`));
  }

  function create(id: string) {
    return getPath(id).asyncAndThen((p) => fslib.fsResult(writeFile(p, "{}")));
  }

  function write(id: string, content: string) {
    return getPath(id).asyncAndThen((p) =>
      fslib.fsResult(writeFile(p, content)),
    );
  }

  function read(id: string) {
    return getPath(id).asyncAndThen((p) =>
      fslib.fsResult(readFile(p, "utf-8")),
    );
  }

  function exists(id: string) {
    return getPath(id).asyncAndThen((p) => fslib.fsResult(pathExists(p)));
  }

  function ls() {
    return fslib
      .ls(directory)
      .map((files) => fslib.filterExt(files, ".json"))
      .map(fslib.stripExt);
  }

  function deleteDocument(id: string) {
    // use force option to avoid throwing if the database record was orphaned
    return getPath(id).asyncAndThen((p) =>
      fslib.fsResult(rm(p, { force: true })),
    );
  }

  return {
    create,
    write,
    read,
    ls,
    delete: deleteDocument,
    exists,
  };
}
