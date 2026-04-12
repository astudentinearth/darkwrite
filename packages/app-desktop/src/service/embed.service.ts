import { db as defaultDb } from "@/db";
import { Embed, NewEmbed } from "@/db/schema";
import { EmbedDAO } from "@/embed/embed.dao";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import { NotFoundError } from "@darkwrite/common";
import { randomUUID } from "crypto";
import log from "electron-log";
import { readFile } from "fs/promises";
import { EmbedFileStore, IEmbedStore } from "../lib/blob-store";
import { getFileInfo } from "../lib/fs";

export class EmbedService {
  private embedRepository: EmbedDAO;
  private workspaceRepository: WorkspaceDAO;

  constructor(
    private db = defaultDb,
    embedRepository?: EmbedDAO,
    workspaceRepository?: WorkspaceDAO,
    private blobStore: IEmbedStore = new EmbedFileStore(),
  ) {
    this.embedRepository = embedRepository ?? new EmbedDAO(this.db);
    this.workspaceRepository = workspaceRepository ?? new WorkspaceDAO(this.db);
  }

  // For easier mocking
  private async read(filePath: string) {
    return readFile(filePath);
  }

  async findFirstDuplicate(fileSize: number, contents: Buffer) {
    const candidates = await this.embedRepository.findAllByFileSize(fileSize);
    if (candidates.length === 0) return null;
    for (const embed of candidates) {
      try {
        const buf = await this.blobStore.get(embed.id);
        if (Buffer.compare(buf, contents) === 0) return embed;
      } catch {
        log.warn(
          `Embed service duplicate check - Could not find the blob for embed:${embed.id}`,
        );
      }
    }
    return null;
  }

  async initializeEmbedWithFileData(filePath: string): Promise<Embed> {
    const file = await getFileInfo(filePath);

    return {
      id: randomUUID(),
      displayName: file.basename,
      fileName: file.basename,
      fileType: file.extension.replace(".", ""),
      fileSize: file.size,
      ownerId: null,
      uploadedAt: new Date(),
      workspaceId: null,
    };
  }

  async createFromFilePath(filePath: string, workspaceId: string) {
    const workspace =
      await this.workspaceRepository.findByIdOrThrow(workspaceId);

    let embed = await this.initializeEmbedWithFileData(filePath);
    embed.workspaceId = workspace.id;

    const buffer = await this.read(filePath);
    const existingEmbed = await this.findFirstDuplicate(embed.fileSize, buffer);
    if (existingEmbed) return existingEmbed;

    embed = await this.embedRepository.create(embed);
    await this.blobStore.put(embed.id, buffer);
    return embed;
  }

  async createFromArrayBuffer(
    buffer: ArrayBuffer,
    fileType: string,
    workspaceId: string,
  ): Promise<Embed> {
    const workspace =
      await this.workspaceRepository.findByIdOrThrow(workspaceId);

    const id = randomUUID();
    let embed: NewEmbed = {
      fileSize: buffer.byteLength,
      fileType: fileType.replace(".", ""),
      id,
      workspaceId: workspace.id,
      uploadedAt: new Date(),
      displayName: Date.now().toString(),
      fileName: `${id}`,
    };
    const buf = Buffer.from(new Uint8Array(buffer));

    const existingEmbed = await this.findFirstDuplicate(embed.fileSize, buf);
    if (existingEmbed) return existingEmbed;

    const saved = await this.embedRepository.create(embed);
    await this.blobStore.put(saved.fileName, buf);
    return saved;
  }

  async getEmbedById(id: string) {
    return this.embedRepository.findById(id);
  }

  async getEmbedUrl(id: string) {
    const embed = await this.embedRepository.findById(id);
    if (!embed) throw new NotFoundError("Embed", id);
    else return `embed://${embed.id}`;
  }

  async getEmbedFileUrl(id: string) {
    return this.blobStore.getUrl(id);
  }
}
