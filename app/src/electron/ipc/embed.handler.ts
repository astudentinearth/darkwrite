
import { EmbedResponseDTO } from "@/common/dto/response/embed.response";
import { ServiceContainer } from "../service-container";

// The default contract will not be implemented here.
// Frontend code will implement an adapter to pass
// array buffer and file paths here, as DOM objects
// are not directly serializable.
// Similarly, cloud APIs will need to implement an
// adapter of their own to build multipart requests.
export class ElectronEmbedAPI {
  static async createFromLocalFile(filePath: string, workspaceId: string) {
    const embed = await ServiceContainer.embedService.createFromFilePath(filePath, workspaceId);
    const url = await ServiceContainer.embedService.getEmbedUrl(embed.id);
    return {embed: embed.mapToDTO(url.href)} satisfies EmbedResponseDTO;
  }

  static async createFromArrayBuffer(buffer: ArrayBuffer, fileType: string, workspaceId: string) {
    const embed = await ServiceContainer.embedService.createFromArrayBuffer(buffer, fileType, workspaceId);
    const url = await ServiceContainer.embedService.getEmbedUrl(embed.id);
    return {embed: embed.mapToDTO(url.href)} satisfies EmbedResponseDTO;
  }

  static async getById(id: string) {
    const embed = await ServiceContainer.embedService.getEmbedById(id);
    if(!embed) return {embed: null} satisfies EmbedResponseDTO;
    const url = await ServiceContainer.embedService.getEmbedUrl(id);
    return {embed: embed.mapToDTO(url.href)} satisfies EmbedResponseDTO;
  }
}