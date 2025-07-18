import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Workspace } from "./workspace.entity";

@Entity("embed")
export class Embed {
  @PrimaryColumn({type: "varchar", generated: "uuid"})
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


  /** Replaces `createdAt` from the previous iteration.  */
  @Column("datetime")
  uploadedAt: Date;

  /** The workspace this embed originated from. If the workspace is deleted,
   *  we can transfer the embeds to a new workspace or delete them altogether.
   */
  @ManyToOne(() => Workspace)
  workspace: Workspace;
}
