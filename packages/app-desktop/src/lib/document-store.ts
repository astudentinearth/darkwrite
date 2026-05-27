import * as fslib from "@/lib/fs";
import { dwErr, type DwError } from "@darkwrite/common";
import { pathExists } from "fs-extra";
import { readFile, rm, writeFile } from "node:fs/promises";
import { ok, type Result, type ResultAsync } from "neverthrow";
import path from "node:path";

export interface IDocumentStore {
  create: (id: string) => ResultAsync<void, DwError>;
  write: (id: string, content: string) => ResultAsync<void, DwError>;
  read: (id: string) => ResultAsync<string, DwError>;
  exists: (id: string) => ResultAsync<boolean, DwError>;
  ls: () => ResultAsync<string[], DwError>;
  delete: (id: string) => ResultAsync<void, DwError>;
}

/** Make a directory act as a JSON document store.
 *  All documents will follow <id>.json file name convention.
 * @param directory Directory to store documents in
 */
export function DocumentFileStore(directory: string): IDocumentStore {
  /**  */

  function getPath(id: string): Result<string, DwError> {
    if (id.includes("/") || id.includes("\\"))
      return dwErr(
        "Invalid document ID.",
        "ID contains characters reserved for file paths.",
      );
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
    return getPath(id)
      .asyncAndThen((path) =>
        exists(id).andThen((e) =>
          e ? ok(path) : dwErr(`Document ${id} not found.`),
        ),
      )
      .andThen((p) => fslib.fsResult(readFile(p, "utf-8")));
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
