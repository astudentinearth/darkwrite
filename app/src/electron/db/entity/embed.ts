import { Column, Entity, PrimaryColumn } from "typeorm";
import { Embed } from "@darkwrite/common";

@Entity("embed")
export class EmbedEntity implements Embed {
  @PrimaryColumn("varchar")
  id: string;
  @Column("varchar")
  displayName: string;
  @Column("text")
  fileName: string;
  @Column("int")
  fileSize: number;
  @Column("varchar")
  filename: string;
  @Column("datetime")
  createdAt: Date;
}
