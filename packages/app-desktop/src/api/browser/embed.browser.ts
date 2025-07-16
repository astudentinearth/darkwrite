import { Embed } from "@darkwrite/common";
import { IEmbedAPI } from "../types";
import { IBrowserDBContext, BrowserDBContext } from "./db-actions.browser";
import { generateId } from "@/lib/utils";

export class BrowserEmbedAPI implements IEmbedAPI {
  constructor(private _db: IBrowserDBContext = new BrowserDBContext()) {}

  public create = async (file: File) => {
    const embed = {
      id: generateId(),
      createdAt: new Date(),
      displayName: file.name,
      filename: file.name,
      fileSize: file.size
    } satisfies Embed;
    await this._db.createEmbed(embed, file);
    return embed;
  };
  public async createFromArrayBuffer (
    buffer: ArrayBuffer,
    fileExt: string,
  ) {
    const id = generateId();
    const embed = {
      id,
      createdAt: new Date(),
      displayName: `${id}.${fileExt}`,
      filename: `${id}.${fileExt}`,
      fileSize: buffer.byteLength
    } satisfies Embed;
    await this._db.createEmbed(embed, new Blob([buffer]));
    return embed;
  };
  public resolveSourceURL = async (id: string) => {
    const data = await this._db.getEmbeddedFile(id);
    if(data==undefined) return "";
    return URL.createObjectURL(data);
  };
}
