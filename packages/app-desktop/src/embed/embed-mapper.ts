import type { EmbedDTO } from "@darkwrite/common";
import type { EmbedRow } from "@/db/schema";

export function embedToDto(embed: EmbedRow, url: string): EmbedDTO {
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
