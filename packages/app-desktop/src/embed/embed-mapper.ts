import { Embed } from "@/db/schema";
import { EmbedDTO } from "@darkwrite/common";

export function embedToDto(embed: Embed, url: string): EmbedDTO {
  const {
    id,
    ownerId,
    fileName,
    fileSize,
    fileType,
    uploadedAt,
    displayName,
    workspaceId,
  } = embed;
  return {
    id,
    ...(ownerId && { ownerId }),
    fileSize,
    fileType,
    uploadedAt,
    displayName: displayName || fileName,
    ...(workspaceId && { workspaceId }),
    url,
  };
}
