export interface Embed {
  id: string;
  fileType: string;
  fileSize: number;
  displayName?: string;
  uploadedAt: Date;
  workspaceId?: string;
}

/** @deprecated use `Embed` instead */
export type EmbedDTO = Embed;

export interface EmbedResponseDTO {
  embed: Embed;
}

export interface EmbedsResponseDTO {
  embeds: Embed[];
}
