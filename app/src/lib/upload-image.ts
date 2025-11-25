import { DarkwriteAPIClient } from "@/api/api-client";
import { EmbedDTO } from "@/common/dto/response/embed.response";
import { useLocalStore } from "@/context/local-state";

export function uploadImage() {
  return new Promise<EmbedDTO>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    const workspaceId = useLocalStore.getState().workspaceId;

    const handleChange = async () => {
      if (!input.files?.length) return;
      const file = input.files[0];
      const { embed } = await DarkwriteAPIClient.embed.create({
        file,
        fileType: file.type,
        workspaceId,
      });
      if (!embed) {
        reject();
      } else resolve(embed);
    };

    input.onchange = handleChange;
    input.click();
  });
}
