import { Embed } from "../entity";
import { BlobFileStore, IBlobStore } from "../lib/blob-store";
import { getFileInfo } from "../lib/fs";
import { EmbedRepository } from "../repository/embed.repository";
import { WorkspaceRepository } from "../repository/workspace.repository";
import { readFile } from "fs/promises";

export class EmbedService {
  constructor(
    private embedRepository: EmbedRepository = new EmbedRepository(),
    private workspaceRepository: WorkspaceRepository = new WorkspaceRepository(),
    private blobStore: IBlobStore = new BlobFileStore(),
  ) {}

  // For easier mocking
  private async read(filePath: string) {
    return readFile(filePath);
  }

  async findFirstDuplicate(fileSize: number, contents: Buffer) {
    const candidates = await this.embedRepository.findAllByFileSize(fileSize);
    if(candidates.length === 0) return null;
    for(const embed of candidates) {
      const buf = await this.blobStore.get(embed.id);
      if(Buffer.compare(buf, contents) === 0) return embed; 
    }
    return null;
  }

  async initializeEmbedWithFileData(filePath: string): Promise<Embed> {
    const file = await getFileInfo(filePath);
    let embed = new Embed();

    embed.displayName = file.basename;
    embed.fileSize = file.size;
    embed.fileType = file.extension;

    return embed;
  }

  async createFromFilePath(filePath: string, workspaceId: string) {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) throw new Error(`Workspace ${workspaceId} not found.`);

    let embed = await this.initializeEmbedWithFileData(filePath);
    embed.uploadedAt = new Date();
    embed.workspace = workspace;

    const buffer = await this.read(filePath);
    const existingEmbed = await this.findFirstDuplicate(embed.fileSize, buffer);
    if(existingEmbed) return existingEmbed;

    embed = await this.embedRepository.save(embed);
    await this.blobStore.put(embed.id, buffer);
    return embed;
  }

  async createFromArrayBuffer(
    buffer: ArrayBuffer,
    fileType: string,
    workspaceId: string,
  ) {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) throw new Error(`Workspace ${workspaceId} not found.`);

    let embed = new Embed();
    embed.fileSize = buffer.byteLength;
    embed.fileType = fileType;
    embed.workspace = workspace;
    embed.uploadedAt = new Date();
    embed.displayName = Date.now().toString();

    const buf = Buffer.from(new Uint8Array(buffer));

    const existingEmbed = await this.findFirstDuplicate(embed.fileSize, buf);
    if(existingEmbed) return existingEmbed;

    embed = await this.embedRepository.save(embed);
    await this.blobStore.put(embed.id, buf);
    return embed;
  }

  async getEmbedById(id: string) {
    return this.embedRepository.findById(id);
  }

  async getEmbedUrl(id: string) {
    const embed = await this.embedRepository.findById(id);
    if (!embed) throw new Error(`Embed ${id} does not exist.`);
    else return this.blobStore.getUrl(id);
  }
}
