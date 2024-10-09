import { Note } from "@darkwrite/common";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("notes")
export class NoteEntity implements Note {
  @PrimaryColumn("varchar")
  id: string;

  @Column("varchar")
  title: string;

  @Column("varchar")
  icon: string;

  @Column("datetime")
  created: Date;

  @Column("datetime")
  modified: Date;

  @Column("boolean", { nullable: true })
  isFavorite?: boolean;

  @Column("varchar", { nullable: true })
  parentID?: string | null;

  @Column("boolean", { nullable: true })
  isTrashed?: boolean;

  @Column("int", { nullable: true })
  favoriteIndex?: number;

  @Column("varchar", { nullable: true })
  todoListID?: string | undefined;

  @Column("int", { nullable: true })
  index?: number | undefined;

  static fromMetadata(data: Note) {
    const entity = new NoteEntity();
    entity.created = data.created;
    entity.icon = data.icon;
    entity.id = data.id;
    entity.index = data.index;
    entity.isFavorite = data.isFavorite;
    entity.isTrashed = data.isTrashed;
    entity.modified = data.modified;
    entity.parentID = data.parentID;
    entity.title = data.title;
    entity.todoListID = data.todoListID;
    entity.favoriteIndex = data.favoriteIndex;
    return entity;
  }

  static fromMetadataArray(data: Note[]) {
    return data.map((x) => this.fromMetadata(x));
  }
}
