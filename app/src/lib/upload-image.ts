import { DarkwriteAPIClient } from "@/api/api-client";
import { EmbedDTO } from "@/common/dto/response/embed.response";
import { getCurrentWorkspaceId } from "@/features/workspaces/store/workspace-actions";

export function uploadImage() {
  return new Promise<EmbedDTO>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) throw new Error("No workspace ID found");

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
