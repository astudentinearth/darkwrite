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

    @Column("int", {nullable: true})
    index?: number | undefined;

    static fromMetadata(data: NoteMetada){
        const entity = new NoteEntity();
        entity.created = data.created;
        entity.icon = data.icon;
        entity.id = data.id;
        entity.index = data.index;
        entity.isFavorite = data.isFavorite;
        entity.isTrashed = data.isTrashed;
        entity.modified = data.modified;
        entity.parentID = data.parentID;
        entity.subnotes = data.subnotes ?? [];
        entity.title = data.title;
        entity.todoListID = data.todoListID;
        return entity;
    }

    static fromMetadataArray(data: NoteMetada[]){
        return data.map((x)=>this.fromMetadata(x));
    }
}