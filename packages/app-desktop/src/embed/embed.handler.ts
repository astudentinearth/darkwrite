import { writeFile } from "node:fs/promises";
import { buildDwError, type DesktopEmbedAPI } from "@darkwrite/common";
import { net } from "electron";
import { okAsync, ResultAsync } from "neverthrow";
import { showSaveDialog } from "@/api/dialog";
import { fsResult } from "@/lib/fs";
import { type HandlerImplements, handler } from "@/types";
import type { IEmbedService } from "./embed.service";
import { embedToDto } from "./embed-mapper";

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

export function EmbedAPI(
  embedService: IEmbedService,
): HandlerImplements<DesktopEmbedAPI> {
  const createFromLocalFile = handler((filePath: string, workspaceId: string) =>
    embedService
      .createFromFilePath(filePath, workspaceId)
      .andThen((embed) =>
        embedService.getEmbedUrl(embed.id).map((url) => embedToDto(embed, url)),
      )
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
        .map((embed) => ({ embed })),
  );

  const getById = handler((id: string) =>
    ResultAsync.combine([
      embedService.getEmbedById(id),
      embedService.getEmbedUrl(id),
    ]).map(([embed, url]) => ({ embed: embedToDto(embed, url) })),
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
      .mapErr((cause) =>
        buildDwError(
          "Something went wrong while encoding embeds.",
          cause.message,
        ),
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
