
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