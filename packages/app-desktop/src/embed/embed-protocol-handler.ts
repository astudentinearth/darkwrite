import { IEmbedService } from "./embed.service";
import { net } from "electron";
import { okAsync } from "neverthrow";

export function embedProtocolHandler(embedService: IEmbedService) {
  return async function (req: Request) {
    const id = req.url.slice("embed://".length);
    const result = await embedService
      .getEmbedFileUrl(id)
      .andThen((url) => okAsync(net.fetch(url.href)));

    if (result.isOk()) return result.value;
    else return Response.json({ error: "Embed not found" }, { status: 404 });
  };
}
