
export interface NoteMetada{
    id: string,
    title: string,
    icon: string,
    created: Date,
    modified: Date,
    isFavorite?: boolean,
    parentID?: string,
    subnotes?: string[]
}