import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Workspace } from "./workspace.entity";
import { EmbedDTO } from "@darkwrite/common/dto/response/embed.response";

@Entity("embed")
export class Embed {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  /** The uploader of this embed. Ignored/`undefined` in offline workspaces. */
  @Column({ type: "varchar", nullable: true })
  ownerId?: string;

  /** MIME type of the file. */
  @Column("varchar")
  fileType: string;

  /** Size of the file in bytes. */
  @Column("int")
  fileSize: number;

  @Column({ type: "text", nullable: true })
  displayName?: string;

  @Column({ type: "text", nullable: false })
  fileName: string;

  /** Replaces `createdAt` from the previous iteration.  */
  @Column("datetime")
  uploadedAt: Date;

  /** The workspace this embed originated from. If the workspace is deleted,
   *  we can transfer the embeds to a new workspace or delete them altogether.
   */
  @ManyToOne(() => Workspace, {
    eager: true,
    nullable: true,
    onDelete: "SET NULL",
  })
  workspace?: Workspace;

  /** @param url Embeds can only be sent after their URL is resolved. */
  mapToDTO(url: string): EmbedDTO {
    const { id, displayName, fileSize, fileType, workspace, uploadedAt } = this;
    return {
      id,
      displayName,
      fileSize,
      fileType,
      uploadedAt,
      url,
      workspaceId: workspace?.id,
    };
  }
}
