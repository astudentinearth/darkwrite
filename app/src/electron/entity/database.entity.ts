import { Column, Entity, PrimaryColumn } from "typeorm";
import { PropertyField } from "@common/field";
import { JSONTransformer } from "../lib/json-transformer";

@Entity("database")
export class Database {
  @PrimaryColumn({type: "varchar", generated: "uuid"})
  id: string;

  @Column({ type: "varchar", nullable: true })
  userId?: string;

  @Column("text")
  name: string;

  @Column("varchar")
  workspaceId: string;

  @Column("datetime")
  createdAt: Date;

    /** Fields map: key -> definition. */
  @Column({
    type: "text",
    nullable: true,
    transformer: JSONTransformer
  })
  propertySchema: Record<string, PropertyField>;
}
