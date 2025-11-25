import { net } from "electron";
import { ServiceContainer } from "../service-container";

export async function embedProtocolHandler(req: Request) {
  const id = req.url.slice("embed://".length);
  try {
    const url = await ServiceContainer.embedService.getEmbedFileUrl(id);
    return net.fetch(url.href);
  } catch {
    return Response.json({ error: "Embed not found" }, { status: 404 });
  }
}
