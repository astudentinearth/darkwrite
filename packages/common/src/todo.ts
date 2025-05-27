/** @deprecated has never been used and will be removed. */
export interface TodoItemBase {
  id: string;
  content: string;
  completed?: boolean;
  listID: string;
}

/** @deprecated has never been used and will be removed. */
export interface TodoListBase {
  id: string;
  name: string;
  sortingOrder: string[]; // an array of UUIDs
}
