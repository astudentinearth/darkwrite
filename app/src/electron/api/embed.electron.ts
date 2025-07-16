import { Embed, ResolvedEmbed } from "@darkwrite/common";
import { app, net, protocol } from "electron";
import fse from "fs-extra";
import { randomUUID } from "node:crypto";
import path, { join } from "node:path";
import { pathToFileURL } from "node:url";
import { DB } from "../db";
import { Paths } from "../lib/paths";

export const EmbedAPI = {
  create: async (filePath: string) => {
    const id = randomUUID();
    const displayName = path.basename(filePath);
    const stats = await fse.stat(filePath);
    const fileSize = stats.size;
    const ext = path.extname(filePath);
    const filename = `${id}${ext}`;
    const embed: Embed = {
      id,
      displayName,
      fileSize,
      filename,
      createdAt: new Date(),
    };

    console.log(id);
    // we want to see if an embed with the same size already exists
    const contents = await fse.readFile(filePath);
    const existing = await EmbedAPI.checkDuplicates(fileSize, contents);
    if (existing != false) return existing;

    await DB.embeds.create(embed);
    await fse.copy(filePath, join(Paths.EMBED_DIR, filename));
    return embed;
  },
  /**
   * Given the byte data and file type, creates an embed and its file
   * @param buf Data of the embed
   * @param fileExt Extension of the file, *without* a period in the beginning.
   */
  createFromArrayBuffer: async (buf: ArrayBuffer, fileExt: string) => {
    const id = randomUUID();
    const embed: Embed = {
      id,
      fileSize: buf.byteLength,
      filename: `${id}.${fileExt}`,
      displayName: `${id}.${fileExt}`,
      createdAt: new Date(),
    };
    const existing = await EmbedAPI.checkDuplicates(
      buf.byteLength,
      Buffer.from(buf),
    );
    if (existing != false) return existing;
    const view = new Uint8Array(buf);
    await fse.writeFile(join(Paths.EMBED_DIR, embed.filename), view);
    await DB.embeds.create(embed);
    return embed;
  },
  checkDuplicates: async (fileSize: number, targetContents: Buffer) => {
    const embeds = await DB.embeds.getBySize(fileSize);
    if (embeds.length > 0) {
      for (const e of embeds) {
        try {
          const existingFile = join(Paths.EMBED_DIR, e.filename);
          const existingContents = await fse.readFile(existingFile);

          const identical =
            Buffer.compare(existingContents, targetContents) === 0;
          if (identical) {
            // we already have this file
            return e;
          }
        } catch {
          continue;
        }
      }
    }
    return false;
  },
  resolve: async (id: string) => {
    const embed = await DB.embeds.getOne(id);
    if (!embed) return null;
    const uri = pathToFileURL(join(Paths.EMBED_DIR, embed.filename));
    //console.log(uri);
    const resolved: ResolvedEmbed = {
      ...embed,
      uri: uri.href,
    };
    return resolved;
  },
};

app.whenReady().then(() => {
  protocol.handle("embed", async (req) => {
    const id = req.url.slice("embed://".length);
    const embed = await EmbedAPI.resolve(id);
    if (!embed)
      return Response.json({ error: "Embed not found" }, { status: 404 });
    return net.fetch(embed.uri);
  });
});
