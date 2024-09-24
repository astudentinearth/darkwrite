
export interface Note{
    id: string,
    title: string,
    icon: string,
    created: Date,
    modified: Date,
    isFavorite?: boolean,
    parentID?: string | null,
    isTrashed?: boolean,
    todoListID?: string // set to a list UUID to show todos in this page,
    index?: number
    favoriteIndex?: number
}

export interface NoteCustomizations{
    font?: "sans" | "serif" | "mono" | "custom"
    customFont?: string,
    largeText?: boolean
}


/**
 * Recursively finds all subnotes in a note
 * @param id UUID of the starting note
 * @param notes set of notes to search from
 */
export function resolveDescendants(id: string, notes: Note[]){
    const result: Note[] = []
    function dfs (id: string) {
        const children: Note[] = notes.filter((n)=>n.parentID===id);
        for(const c of children){
            result.push(c);
            dfs(c.id)
        }
    }
    dfs(id);
    return result;
}

/**
 * Recursively finds the highest level parent of a given note
 * @param id UUID of the starting note
 * @param notes set of notes to search from
 */
export function resolveParents(id: string, notes: Note[]){
    const noteIndex = notes.findIndex((n)=>n.id===id);
    if(noteIndex==-1) return [];
    const note = notes[noteIndex];
    if(note.parentID == null) return [];
    const nodes:Note[] = [];
    for(let id: (string | null | undefined) = note.parentID; id != null;){ // start from the first parent
        const parent = notes.find((n)=>n.id===id); // find the parent
        if(parent){ 
            nodes.push(parent); // add it to nodes
            id = parent.parentID; // attempt resolving the next parent
        }
        else break
    }
    return nodes;
}

export type NoteExportType = "html" | "json" | "md";

export const FontStyleClassNames = {
    "sans": "darkwrite-sans",
    "serif": "darkwrite-serif",
    "mono": "darkwrite-mono",
    "custom": "darkwrite-custom-font"
}