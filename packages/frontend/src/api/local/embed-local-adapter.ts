import { IEmbedAPI } from "@darkwrite/common";
import { CreateEmbedDTO } from "@darkwrite/common";
import { ResultAsync } from "neverthrow";

export class EmbedLocalAdapter implements IEmbedAPI {
  create(dto: CreateEmbedDTO) {
    const { file, fileType, workspaceId } = dto;
    const filePath = window.webUtils.getPathForFile(file);

    if (filePath === "") {
      return ResultAsync.fromSafePromise(file.arrayBuffer()).andThen((buffer) =>
        window.api.embed.createFromArrayBuffer(buffer, fileType, workspaceId),
      );
    }
    return window.api.embed.createFromLocalFile(filePath, workspaceId);
  }

  getById(id: string) {
    return window.api.embed.getById(id);
  }

  getEncoded(ids: string[]) {
    return window.api.embed.getEncoded(ids);
  }

  download(id: string) {
    return window.api.embed.download(id);
  }
}
