
import { NoteMetada } from "@common/note";
import { useNotesStore } from "@renderer/context/notes-context";

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
        public parentID?:string | null){}
    
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

    static async create(parent?: string) {
        await window.api.note.create("Untitled page", parent);
        useNotesStore.getState().fetch();
    }
}

export async function getAllNotes(){
    //TODO: IPC call here
    const notes = await window.api.note.getAll();
    const arr: Note[]=[]
    for(const n of notes){
        const note = new Note(n.id, n.title, n.icon, n.created, n.modified, n.isFavorite, n.subnotes, n.parentID);
        arr.push(note);
    }
    return arr;
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