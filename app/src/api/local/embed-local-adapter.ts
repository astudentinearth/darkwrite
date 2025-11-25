import { IEmbedAPI } from "@/common/contract";
import { CreateEmbedDTO } from "@/common/dto/request/embed.request";

export class EmbedLocalAdapter implements IEmbedAPI {
  async create(dto: CreateEmbedDTO) {
    const { file, fileType, workspaceId } = dto;
    const filePath = window.webUtils.getPathForFile(file);

    if (filePath === "") {
      const buffer = await file.arrayBuffer();
      const response = await window.api.embed.createFromArrayBuffer(
        buffer,
        fileType,
        workspaceId,
      );
      return response;
    }

    const response = await window.api.embed.createFromLocalFile(
      filePath,
      workspaceId,
    );
    return response;
  }

  async getById(id: string) {
    return window.api.embed.getById(id);
  }
}
