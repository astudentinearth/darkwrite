import { NoteMetada } from "@common/note";
import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity("notes")
export class NoteEntity implements NoteMetada{
    @PrimaryColumn("varchar")
    id: string

    @Column("varchar")
    title: string

    @Column("varchar")
    icon: string

    @Column("date")
    created: Date

    @Column("date")
    modified: Date 

    @Column("boolean", {nullable: true})
    isFavorite?: boolean 

    @Column("varchar", {nullable: true})
    parentID?: string | null

    @Column("text", {name: "subnotes"})
    private subnotes_str: string = "";

    @Column("boolean", {nullable: true})
    isTrashed?: boolean
    
    get subnotes(): string[]{
        if(this.subnotes_str === "") return []
        return JSON.parse(this.subnotes_str);
    }

    set subnotes(value: string[]){
        this.subnotes_str = JSON.stringify(value);
    }

    addSubnote(id: string){
        const newArr = [...this.subnotes];
        newArr.push(id);
        this.subnotes = newArr;
    }

    removeSubnote(id:string){
        const newArr = [...this.subnotes].filter((x)=>x!==id);
        this.subnotes = newArr;
    }
    @Column("varchar", {nullable: true})
    todoListID?: string | undefined;
}