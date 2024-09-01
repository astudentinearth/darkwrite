
export interface TodoItemBase{
    id: string,
    content: string,
    completed?: boolean,
    listID: string
}

export interface TodoListBase{
    id: string,
    name: string,
    sortingOrder: string[] // an array of UUIDs
}
