import type { Embed } from "@darkwrite/common";
import type { EmbedRow } from "@/db/schema";

export function embedToDto(embed: EmbedRow): Embed {
  const {
    id,
    fileName,
    fileSize,
    fileType,
    uploadedAt,
    displayName,
    workspaceId,
  } = embed;
  return {
    id,
    fileSize,
    fileType,
    uploadedAt,
    displayName: displayName || fileName,
    ...(workspaceId && { workspaceId }),
  };
}
