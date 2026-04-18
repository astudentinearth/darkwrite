export interface ContextMenuEditActions {
  cut: boolean;
  copy: boolean;
  paste: boolean;
  pasteWithoutFormatting: boolean;
  selectAll: boolean;
  delete: boolean;
}

export interface NativeContextMenuData {
  editActions: ContextMenuEditActions;
  spellingSuggestions: string[];
  editable: boolean;
  x: number;
  y: number;
}
