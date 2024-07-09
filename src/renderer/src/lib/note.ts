
import { NoteMetada } from "@common/note";

//TODO: Remove mocks when API is built

export class Note implements NoteMetada{
    private contents: string | null = null;
    constructor(
        public id: string,
        public title: string,
        public icon: string,
        public created: Date,
        public modified: Date,
        public isFavorite?: boolean,
        public subnotes: string[] = [],
        public parentID?:string){}
    
    async getContents(){
        //TODO: Call electron API to load contents
        return "Lorem ipsum dolor sit amet"
    }

    async save(){
        //TODO: Call electron API to save all values here
    }

    async trash(){
        //TODO: trash the note
    }
    
    hasSubnotes(): boolean{
        return this.subnotes.length == 0 ? false : true;
    }

    hasParent(): boolean{
        return this.parentID == null ? false : true;
    }
}

export async function getAllNotes(){
    //TODO: IPC call here
    return FAKE_NOTES_FOR_DEVELOPMENT;
}

//TODO: Build a faker for this maybe
const FAKE_NOTES_FOR_DEVELOPMENT = [
    new Note("1", "Hello world", "❤️", new Date(), new Date()),
    new Note("2", "top level note", "🧪", new Date(), new Date(), false, ["5"]),
    new Note("3", "Important document with a relatively long title", "📄", new Date(), new Date()),
    new Note("4", "Reading list", "📚", new Date(), new Date()),
    new Note("5", "nested note", "📚", new Date(), new Date(), false, ["6"], "2"),
    new Note("6", "2 levels down", "😊", new Date(), new Date(), false, ["7"], "5"),
    new Note("7", "3 levels down", "💀", new Date(), new Date(), false, [], "7")
]