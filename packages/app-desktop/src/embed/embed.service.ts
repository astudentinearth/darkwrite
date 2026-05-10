import { DatabaseType } from "@/db";
import { Embed, NewEmbed } from "@/db/schema";
import { resolveTx, transactional } from "@/db/transactional";
import { EmbedDAO } from "@/embed/embed.dao";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import { randomUUID } from "crypto";
import log from "electron-log";
import { readFile } from "fs/promises";
import { okAsync, ResultAsync } from "neverthrow";
import { IEmbedStore } from "../lib/blob-store";
import { fsResult, getFileInfo } from "../lib/fs";

export function EmbedService(db: DatabaseType, blobStore: IEmbedStore) {
  const embedDao = EmbedDAO(() => resolveTx(db));
  const workspaceDao = WorkspaceDAO(() => resolveTx(db));

  const _read = (path: string) => fsResult(readFile(path));

  const findFirstDuplicate = (fileSize: number, contents: Buffer) =>
    embedDao.findAllByFileSize(fileSize).andThen((candidates) => {
      if (candidates.length === 0) return okAsync(null);
      return ResultAsync.fromSafePromise(
        (async () => {
          for (const embed of candidates) {
            const buf = await blobStore.get(embed.id);
            if (buf.isOk()) {
              if (Buffer.compare(buf.value, contents) === 0) return embed;
            } else
              log.warn(
                `Embed service duplicate check - Could not find the blob for embed:${embed.id}`,
              );
          }
          return null;
        })(),
      );
    });

  const initializeEmbedWithFileData = (filePath: string) =>
    getFileInfo(filePath).map(
      (file) =>
        ({
          id: randomUUID(),
          displayName: file.basename,
          fileName: file.basename,
          fileType: file.extension.replace(".", ""),
          fileSize: file.size,
          ownerId: null,
          uploadedAt: new Date(),
          workspaceId: null,
        }) satisfies Embed,
    );

  const createFromFilePath = (filePath: string, workspaceId: string) =>
    transactional(
      () =>
        workspaceDao
          .findById(workspaceId)
          .andThen(() => initializeEmbedWithFileData(filePath))
          .andThen((e) => _read(filePath).map((buf) => ({ e, buf })))
          .andThen(({ e, buf }) =>
            findFirstDuplicate(e.fileSize, buf).map((duplicate) => ({
              e,
              buf,
              duplicate,
            })),
          )
          .andThen(({ e, buf, duplicate }) =>
            duplicate
              ? okAsync(duplicate)
              : embedDao
                  .create(e)
                  .andThen((e) => blobStore.put(e.id, buf).map(() => e)),
          ),
      db,
    );

  const createFromArrayBuffer = (
    buffer: ArrayBuffer,
    fileType: string,
    workspaceId: string,
  ) => {
    const buf = Buffer.from(new Uint8Array(buffer));
    return transactional(
      () =>
        workspaceDao
          .findById(workspaceId)
          .map(() => {
            const id = randomUUID();
            return {
              id,
              fileType: fileType.replace(".", ""),
              fileSize: buffer.byteLength,
              workspaceId: workspaceId,
              uploadedAt: new Date(),
              displayName: Date.now().toString(),
              fileName: `${id}`,
            } satisfies NewEmbed;
          })
          .andThen((e) =>
            findFirstDuplicate(e.fileSize, buf).map((duplicate) => ({
              e,
              duplicate,
            })),
          )
          .andThen(({ e, duplicate }) =>
            duplicate
              ? okAsync(duplicate)
              : embedDao.create(e).andThen((e) => blobStore.put(e.id, buf)),
          ),
      db,
    );
  };

  const getEmbedById = (id: string) => embedDao.findById(id);
  const getEmbedUrl = (id: string) =>
    embedDao.findById(id).map((e) => `embed://${e.id}`);
  const getEmbedFileUrl = (id: string) => blobStore.getUrl(id);

  return {
    createFromFilePath,
    createFromArrayBuffer,
    getEmbedUrl,
    getEmbedFileUrl,
    getEmbedById,
  };
}

export type IEmbedService = ReturnType<typeof EmbedService>;
