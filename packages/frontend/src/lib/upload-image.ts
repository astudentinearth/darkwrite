import { DarkwriteAPIClient } from "@/api/api-client";
import { EmbedDTO } from "@darkwrite/common";

export function uploadImage(
  getCurrentWorkspaceId: () => string | null,
): Promise<EmbedDTO> {
  return new Promise<EmbedDTO>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) throw new Error("No workspace ID found");

    const handleChange = async () => {
      if (!input.files?.length) return;
      const file = input.files[0];
      const result = await DarkwriteAPIClient.embed.create({
        file,
        fileType: file.type,
        workspaceId,
      });
      if (result.isErr()) reject();
      else resolve(result.value.embed);
    };

    input.onchange = handleChange;
    input.click();
  });
}
