import fse from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { DwResultAsync } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { fsResult, rmIfExists } from "./fs";
import { Paths } from "./paths";

export interface IEmbedStore {
  put: (fileName: string, buf: Buffer) => DwResultAsync<void>;
  get: (fileName: string) => DwResultAsync<Buffer>;
  getUrl: (fileName: string) => DwResultAsync<URL>;
  delete: (fileName: string) => DwResultAsync<void>;
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
