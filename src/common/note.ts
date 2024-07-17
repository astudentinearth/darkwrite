
export interface NoteMetada{
    id: string,
    title: string,
    icon: string,
    created: Date,
    modified: Date,
    isFavorite?: boolean,
    parentID?: string | null,
    subnotes?: string[],
    isTrashed?: boolean,
    todoListID?: string // set to a list UUID to show todos in this page
}