import { EmbedResponseDTO } from "@/common/dto/response/embed.response";
import { NotFoundError } from "@/common/error";
import { dialog, net } from "electron";
import { writeFile } from "fs/promises";
import { EmbedService } from "../service/embed.service";

const embedService = new EmbedService();

// The default contract will not be implemented here.
// Frontend code will implement an adapter to pass
// array buffer and file paths here, as DOM objects
// are not directly serializable.
// Similarly, cloud APIs will need to implement an
// adapter of their own to build multipart requests.
export class ElectronEmbedAPI {
  static async createFromLocalFile(filePath: string, workspaceId: string) {
    const embed = await embedService.createFromFilePath(filePath, workspaceId);
    const url = await embedService.getEmbedUrl(embed.id);
    return { embed: embed.mapToDTO(url) } satisfies EmbedResponseDTO;
  }

  static async createFromArrayBuffer(
    buffer: ArrayBuffer,
    fileType: string,
    workspaceId: string,
  ) {
    const embed = await embedService.createFromArrayBuffer(
      buffer,
      fileType,
      workspaceId,
    );
    const url = await embedService.getEmbedUrl(embed.id);
    return { embed: embed.mapToDTO(url) } satisfies EmbedResponseDTO;
  }

  static async getById(id: string) {
    const embed = await embedService.getEmbedById(id);
    if (!embed) return { embed: null } satisfies EmbedResponseDTO;
    const url = await embedService.getEmbedUrl(id);
    return { embed: embed.mapToDTO(url) } satisfies EmbedResponseDTO;
  }

  static async getEncoded(ids: string[]) {
    const embeds: Record<string, string> = {};
    for (const id of ids) {
      const url = await embedService.getEmbedFileUrl(id);
      const response = await net.fetch(url.href);
      if (!response.ok) continue;
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      embeds[id] =
        `data:${response.headers.get("Content-Type")};base64,${base64}`;
    }
    return embeds;
  }

  static async fetch(id: string) {
    const url = await embedService.getEmbedFileUrl(id);
    const response = await net.fetch(url.href);
    if (!response.ok) throw new NotFoundError("Embed", id);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  }

  static async download(id: string) {
    const url = await embedService.getEmbedFileUrl(id);
    const response = await net.fetch(url.href);
    if (!response.ok) throw new NotFoundError("Embed", id);

    const embed = await embedService.getEmbedById(id);
    if (!embed) throw new NotFoundError("Embed", id);

    const arrayBuffer = await response.arrayBuffer();
    const result = await dialog.showSaveDialog({
      filters: [{ name: "All Files", extensions: ["*"] }],
      defaultPath: `${embed.displayName ?? embed.fileName + embed.fileType.replace(".", "")}`,
    });
    if (result.canceled || !result.filePath) return;
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(result.filePath, buffer);
  }
}
