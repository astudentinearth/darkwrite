
export interface Embed {
  id: string;
  /** The uploader of this embed. Ignored/`undefined` in offline workspaces. */
  ownerId?: string;
  /** MIME type of the file. */
  fileType: string;
  /** Size of the file in bytes. */
  fileSize: number;
  displayName?: string;
  /** Replaces `createdAt` from the previous iteration.  */
  uploadedAt: Date;
  /** The workspace this embed originated from. If the workspace is deleted, 
   *  we can transfer the embeds to a new workspace or delete them altogether.
   */
  workspaceId: string;
}