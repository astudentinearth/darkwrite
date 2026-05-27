/* eslint-disable no-redeclare */

import { accessSync } from "node:fs";
import path from "node:path";
import { buildDwError, type DwError, dwErr } from "@darkwrite/common";
import fse, { readFile, writeFile } from "fs-extra";
import { ok, Result, ResultAsync } from "neverthrow";

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

// new result API

const fsError = (e: unknown): DwError => {
  return buildDwError("Filesystem error.", String(e));
};

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

export function assertExists(filepath: string) {
  return ResultAsync.fromSafePromise(fse.pathExists(filepath)).andThen(
    (exists) => (exists ? ok() : dwErr(`File ${filepath} not found.`)),
  );
}

export const assertAccessibleSync = Result.fromThrowable(
  (filepath: string) => accessSync(filepath, fse.constants.W_OK),
  (e) => buildDwError(`File has no write access.`, String(e)),
);

export const pathExists = (filePath: string) =>
  fsResult(fse.pathExists(filePath));

export const readFileUtf8 = (filepath: string) =>
  fsResult(readFile(filepath, "utf8"));

export const writeFileUtf8 = (filepath: string, content: string) =>
  fsResult(writeFile(filepath, content, "utf8"));

export const writeBinaryFile = (
  filepath: string,
  buffer: Buffer | Uint8Array,
) => fsResult(writeFile(filepath, buffer));

export const ensureDir = (path: string) => fsResult(fse.ensureDir(path));
export const ensureDirs = (...paths: string[]) =>
  ResultAsync.combine(paths.map(ensureDir));
