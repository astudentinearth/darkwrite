/* eslint-disable no-redeclare */
import fse from "fs-extra";
import { ResultAsync } from "neverthrow";
import path from "path";

export async function rmIfExists(path: string) {
  if (await fse.pathExists(path)) {
    await fse.rm(path, {
      recursive: true,
      force: true,
    });
  }
}

export function getFileInfo(filePath: string) {
  const basename = path.basename(filePath);
  const extension = path.extname(filePath);
  return fsResult(fse.stat(filePath)).map((stat) => ({
    size: stat.size,
    extension,
    basename,
  }));
}

/** @deprecated */
export async function ls_legacy(dir: string) {
  return await fse.readdir(dir);
}

export function checkAccess(_path: string) {
  try {
    fse.accessSync(_path, fse.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export async function dirSize(root: string) {
  let total = 0;
  const files = await fse.readdir(root, { recursive: true, encoding: "utf-8" });
  for (const file of files) {
    const fullPath = path.join(root, file);
    const stats = await fse.lstat(fullPath);
    if (stats.isFile()) {
      total += stats.size;
    }
  }
  return total;
}

export class FileNotFoundError extends Error {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`);
    this.name = "FileNotFoundError";
  }
}

// new result API

export type FsError = { type: "fs-error"; cause: NodeJS.ErrnoException };

const fsError = (e: unknown): FsError => ({
  type: "fs-error",
  cause: e as NodeJS.ErrnoException,
});

/** Automatically wrap Node FS promises with ResultAsync<T, FsError> */
export const fsResult = <T>(promise: Promise<T>) =>
  ResultAsync.fromPromise(promise, fsError);

export function ls(dir: string) {
  return fsResult(fse.readdir(dir));
}

export function filterExt(files: string[], ext: string) {
  return files.filter((f) => path.extname(f) === ext);
}

export function stripExt(files: string): string;
export function stripExt(files: string[]): string[];
export function stripExt(files: string | string[]) {
  if (typeof files === "string")
    return path.basename(files, path.extname(files));
  else return files.map((f) => stripExt(f));
}
