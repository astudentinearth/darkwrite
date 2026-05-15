import { showSaveDialog } from "@/api/dialog";
import { DbError } from "@/db/transactional";
import { FsError, fsResult } from "@/lib/fs";
import { handler, HandlerImplements } from "@/types";
import {
    DesktopEmbedAPI,
    EmbedError,
    InternalError,
    WorkspaceError,
} from "@darkwrite/common";
import { net } from "electron";
import { writeFile } from "fs/promises";
import { okAsync, ResultAsync } from "neverthrow";
import { embedToDto } from "./embed-mapper";
import { IEmbedService } from "./embed.service";

// The default contract will not be implemented here.
// Frontend code will implement an adapter to pass
// array buffer and file paths here, as DOM objects
// are not directly serializable.
// Similarly, cloud APIs will need to implement an
// adapter of their own to build multipart requests.

const fetchEmbed = (url: URL) =>
  ResultAsync.fromPromise(
    net.fetch(url.href).then((response) => response.arrayBuffer()),
    () => ({ type: "_internal-fetch-error" }) as const,
  );

const fetchAndEncode = (url: URL) =>
  ResultAsync.fromPromise(
    net
      .fetch(url.href)
      .then((response) =>
        response.arrayBuffer().then((buf) => ({ response, buf })),
      )
      .then(
        ({ response, buf }) =>
          `data:${response.headers.get("Content-Type")};base64,${Buffer.from(buf).toString("base64")}`,
      ),
    () => ({ type: "_internal-fetch-error" }) as const,
  );

const mapErrors = (
  error: DbError | EmbedError | FsError | WorkspaceError,
): EmbedError | WorkspaceError | InternalError => {
  switch (error.type) {
    case "db-error":
      return {
        type: "internal-error",
        message: "Database error",
      };

    case "file-not-found":
    case "fs-error":
      return {
        type: "internal-error",
        message: "File not found.",
      } satisfies InternalError;

    case "workspace-failed-to-delete":
    case "workspace-failed-to-create":
    case "workspace-not-found":
    case "embed-not-found":
      return error;
  }
};

export function EmbedAPI(
  embedService: IEmbedService,
): HandlerImplements<DesktopEmbedAPI> {
  const createFromLocalFile = handler((filePath: string, workspaceId: string) =>
    embedService
      .createFromFilePath(filePath, workspaceId)
      .andThen((embed) =>
        embedService.getEmbedUrl(embed.id).map((url) => embedToDto(embed, url)),
      )
      .mapErr(mapErrors)
      .map((embed) => ({ embed })),
  );

  const createFromArrayBuffer = handler(
    (buffer: ArrayBuffer, fileType: string, workspaceId: string) =>
      embedService
        .createFromArrayBuffer(buffer, fileType, workspaceId)
        .andThen((embed) =>
          embedService
            .getEmbedUrl(embed.id)
            .map((url) => embedToDto(embed, url)),
        )
        .map((embed) => ({ embed }))
        .mapErr(mapErrors),
  );

  const getById = handler((id: string) =>
    ResultAsync.combine([
      embedService.getEmbedById(id),
      embedService.getEmbedUrl(id),
    ])
      .map(([embed, url]) => ({ embed: embedToDto(embed, url) }))
      .mapErr((error) =>
        error.type === "db-error"
          ? ({
              type: "internal-error",
              message: "Database error",
            } satisfies InternalError)
          : error,
      ),
  );

  const download = handler((id: string) =>
    embedService
      .getEmbedFileUrl(id)
      .andThen(fetchEmbed)
      .andThen((buffer) =>
        ResultAsync.combine([okAsync(buffer), embedService.getEmbedById(id)]),
      )
      .andThen(([buffer, embed]) =>
        ResultAsync.combine([
          okAsync(buffer),
          showSaveDialog({
            filters: [{ name: "All Files", extensions: ["*"] }],
            defaultPath: `${embed.displayName ?? embed.fileName + embed.fileType.replace(".", "")}`,
          }),
        ]),
      )
      .andThen(([buffer, filepath]) =>
        fsResult(writeFile(filepath, Buffer.from(buffer))),
      )
      .orElse(() => okAsync()),
  );

  const getEncoded = handler((ids: string[]) =>
    ResultAsync.combine(
      ids.map((id) =>
        embedService.getEmbedFileUrl(id).map((url) => ({ id, url })),
      ),
    )
      .andThen((items) =>
        ResultAsync.combine(
          items.flatMap((item) =>
            fetchAndEncode(item.url)
              .map((base64) => [{ id: item.id, base64 }])
              .orElse(() => okAsync([] as { id: string; base64: string }[])),
          ),
        ),
      )
      .map((items) =>
        items.flat().reduce(
          (acc, current) => {
            acc[current.id] = current.base64;
            return acc;
          },
          {} as Record<string, string>,
        ),
      )
      .mapErr(
        () =>
          ({
            type: "internal-error",
            message: "Something went wrong while encoding embeds.",
          }) satisfies InternalError,
      ),
  );

  return {
    getById,
    getEncoded,
    download,
    createFromArrayBuffer,
    createFromLocalFile,
  };
}

