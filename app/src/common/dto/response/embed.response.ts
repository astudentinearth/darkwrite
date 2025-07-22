
export interface EmbedDTO {
  id: string;
  ownerId?: string;
  fileType: string;
  fileSize: number;
  displayName?: string;
  uploadedAt: Date;
  workspaceId: string;
  url: string;
}

export interface EmbedResponseDTO {
  embed: EmbedDTO | null;
}

export interface EmbedsResponseDTO {
  embeds: EmbedDTO[];
}

