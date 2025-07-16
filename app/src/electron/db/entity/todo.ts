import { TodoItemBase, TodoListBase } from "@darkwrite/common";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("todos")
export class TodoEntity implements TodoItemBase {
  @PrimaryColumn("varchar")
  id: string;

  @Column("text")
  content: string;

  @Column("boolean")
  completed?: boolean;

  @Column("varchar")
  listID: string;
}

@Entity("lists")
export class TodoListEntity implements TodoListBase {
  @PrimaryColumn("varchar")
  id: string;

  @Column("varchar")
  name: string;

  @Column("text", { name: "sortingOrder" })
  private sortOrderStr: string;

  get sortingOrder(): string[] {
    return JSON.parse(this.sortOrderStr);
  }

  set sortingOrder(value: string[]) {
    this.sortOrderStr = JSON.stringify(value);
  }
}
