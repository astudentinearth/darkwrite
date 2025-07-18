import { WorkspaceConfig } from "@/lib/workspace-config";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { JSONTransformer } from "../lib/json-transformer";

@Entity("workspace")
export class Workspace {
  @PrimaryColumn({type: "varchar", generated: "uuid"})
  id: string;

  @Column({ type: "varchar", nullable: true })
  owner_id?: string;

  @Column("text")
  name: string;

  @Column({ type: "text", nullable: true })
  icon_url?: string;

  @Column("datetime")
  created_at: Date;

  @Column({
    type: "text",
    nullable: true,
    transformer: JSONTransformer
  })
  config: WorkspaceConfig;
}
