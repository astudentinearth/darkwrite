import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Database } from "./database.entity";
import { Workspace } from "./workspace.entity";
import { NoteDTO } from "@/common/dto";

@Entity("note")
export class Note {
  @PrimaryColumn({ type: "varchar", generated: "uuid" })
  id: string;

  @Column({ type: "varchar", nullable: true })
  /** Owner of this note. `undefined` means the note is stored on-device only. If the note is related to a server, it will contain the ID of its owner. */
  userId?: string | null;

  /** The ID of the database this note is tied to. `undefined` means it is not part of a database. Replaces the unused `todoListID` from the previous iteration. */
  @ManyToOne(() => Database, { eager: true })
  database?: Database | null;

  /** The ID of the workspace this note belongs to. Databases can be partitioned by this field if deemed necessary.
   * During migrations from v0.1-0.5x alphas, a default workspace should be created and the ID of that worksapce should be integrated. */
  @ManyToOne(() => Workspace, { eager: true, onDelete: "CASCADE" })
  workspace: Workspace;

  /** The ID of the note which is one level higher in the tree than this note. Renames the `parentID` field from the previous iteration for consistency. */
  @Column({ type: "varchar", nullable: true })
  parentId?: string | null;

  /** The values for the custom properties this note has, according to the tied database property schema. Each property key is mapped directly to a value. */
  @Column({
    type: "text",
    nullable: true,
    transformer: {
      to: (value: Record<string, string> | undefined) =>
        value ? JSON.stringify(value) : null,
      from: (value: string | null) => (value ? JSON.parse(value) : undefined),
    },
  })
  propertyValues?: Record<string, string>;

  @Column("text")
  title: string;

  @Column({ type: "text", nullable: true })
  icon?: string | null;

  /** Renames the `created` field from the previous iteration. Migrate accordingly. */
  @Column("datetime")
  createdAt: Date;

  /** Renames the `modified` field from the previous iteration. Migrate accordingly. */
  @Column("datetime")
  modifiedAt: Date;

  /** Holds the date this note was last moved into trash. */
  @Column({ type: "datetime", nullable: true })
  trashedAt?: Date;

  @Column("boolean", { nullable: true })
  isFavorite?: boolean;

  @Column("boolean", { nullable: true })
  isTrashed?: boolean;

  /** base36 order hint to determine order in the favorites section of the sidebar. Replaces the `favoriteIndex` field from the previous iteration.
   *  During migrations from v0.1-0.5x alphas, hints should be calculated depending on existing indices.
   */
  @Column("varchar")
  favoriteOrderHint: string;

  /** base36 order hint for sidebar/database ordering. Replaces the `index` field from the previous iteration.
   *  During migrations from v0.1-0.5x alphas, hints should be calculated depending on existing indices.
   */
  @Column("varchar")
  orderHint: string;

  mapToDTO() {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      favoriteOrderHint: this.favoriteOrderHint,
      modifiedAt: this.modifiedAt,
      orderHint: this.orderHint,
      workspaceId: this.workspace.id,
      databaseId: this.database?.id,
      icon: this.icon,
      isFavorite: this.isFavorite,
      isTrashed: this.isTrashed,
      parentId: this.parentId,
      propertyValues: this.propertyValues,
      trashedAt: this.trashedAt,
      userId: this.userId,
    } satisfies NoteDTO;
  }
}
