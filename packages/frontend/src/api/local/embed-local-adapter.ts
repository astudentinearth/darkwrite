import type { CreateEmbedDTO, DesktopEmbedAPI } from "@darkwrite/common";
import { ResultAsync } from "neverthrow";

export function EmbedAdapter(api: DesktopEmbedAPI) {
  function create(dto: CreateEmbedDTO) {
    const { file, fileType, workspaceId } = dto;
    const filePath = window.webUtils.getPathForFile(file);

    if (filePath === "") {
      return ResultAsync.fromSafePromise(file.arrayBuffer()).andThen((buffer) =>
        api.createFromArrayBuffer(buffer, fileType, workspaceId),
      );
    }
    return api.createFromLocalFile(filePath, workspaceId);
  }

  function getById(id: string) {
    return api.getById(id);
  }

  function getEncoded(ids: string[]) {
    return api.getEncoded(ids);
  }

  function download(id: string) {
    return api.download(id);
  }

  return { create, getById, getEncoded, download };
}
