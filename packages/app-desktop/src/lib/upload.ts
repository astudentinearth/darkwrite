import { ResolvedEmbed } from "@darkwrite/common";
import { EmbedAPI } from "@/api";

export function uploadImage(): Promise<ResolvedEmbed> {
  return new Promise<ResolvedEmbed>((resolve, reject) => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    const change = async () => {
      if (!inp.files?.length) return;
      const api = EmbedAPI();
      const file = inp.files[0];
      try {
        const embed = await api.create(file);
        const uri = await api.resolveSourceURL(embed.id);
        if (uri) resolve({...embed, uri});
        else throw new Error("Could not resolve embed.");
      } catch (error) {
        reject(error);
      }
    };
    inp.onchange = change;
    inp.click();
  });
}
