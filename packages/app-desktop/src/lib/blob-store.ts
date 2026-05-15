import fse from "fs/promises";
import { join } from "path";
import { Paths } from "./paths";
import { FsError, fsResult, rmIfExists } from "./fs";
import { pathToFileURL } from "url";
import { okAsync, ResultAsync } from "neverthrow";

export type EmbedStoreError = FsError;

export interface IEmbedStore {
  put: (fileName: string, buf: Buffer) => ResultAsync<void, EmbedStoreError>;
  get: (fileName: string) => ResultAsync<Buffer, EmbedStoreError>;
  getUrl: (fileName: string) => ResultAsync<URL, EmbedStoreError>;
  delete: (fileName: string) => ResultAsync<void, EmbedStoreError>;
}

export function EmbedFileStore(): IEmbedStore {
  function getBlobPath(fileName: string) {
    return join(Paths.EMBED_DIR, fileName);
  }

  function put(fileName: string, buf: Buffer) {
    return fsResult(fse.writeFile(getBlobPath(fileName), buf));
  }

  function get(fileName: string) {
    return fsResult(fse.readFile(getBlobPath(fileName)));
  }

  function deleteEmbed(fileName: string) {
    return fsResult(rmIfExists(getBlobPath(fileName)));
  }

  function getUrl(fileName: string) {
    return okAsync(pathToFileURL(getBlobPath(fileName)));
  }

  return {
    put,
    get,
    delete: deleteEmbed,
    getUrl,
  };
}
