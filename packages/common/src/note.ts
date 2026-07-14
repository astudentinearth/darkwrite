export enum NoteType {
  Doc = "doc",
  Database = "database",
  DatabaseView = "database_view",
}

export interface NoteDTO {
  id: string;
  title: string;
  type: NoteType;
  icon: string | null;
  /** This defines relationships between notes. Children of a database belong to that database. Child database view type notes of a database are also views of that database. */
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
  trashedAt: string | null;
  favoriteOrderHint: string;
  isFavorite: boolean | null;
  isTrashed: boolean | null;
  workspaceId: string; // ID of the workspace this note belongs to
}

export enum DatabaseViewType {
  Board = "board",
  Table = "table",
  Calendar = "calendar",
}

export interface DatabaseViewMeta {
  id: string;
  type: DatabaseViewType;
}

export function resolveUpperTree(id: string, notes: Record<string, NoteDTO>) {
  const list: NoteDTO[] = [];
  if (!notes[id] || !("parentId" in notes[id])) return [];
  for (let currentId = notes[id].parentId; ; ) {
    if (currentId == null) return list;
    const parent = notes[currentId];
    if (!parent) break;
    list.push(parent);
    currentId = parent.parentId;
    if (id === currentId) break; // prevent circular reference
  }
  return list;
}

/**
 * Returns true if potentialChildId is a descendant of potentialParentId
 * @param potentialChildId
 * @param potentialParentId
 * @param notes
 * @returns "CIRCULAR" if child and parent are in a circular reference, true if is a descendant, false in all other cases
 */
export function isDescendant(
  potentialChildId: string,
  potentialParentId: string,
  notesMapOrGetter: Record<string, NoteDTO> | ((id: string) => NoteDTO),
): boolean | "CIRCULAR" {
  const visited = new Set<string>();
  if (potentialChildId === potentialParentId) return "CIRCULAR";

  const getNote = (id: string) => {
    if (typeof notesMapOrGetter === "function") return notesMapOrGetter(id);
    else return notesMapOrGetter[id];
  };

  let currentNoteId = potentialChildId;
  while (!visited.has(currentNoteId)) {
    const currentNote = getNote(currentNoteId);
    if (!currentNote) return false;
    visited.add(currentNoteId);
    if (!currentNote.parentId) break;
    currentNoteId = currentNote.parentId;
  }
  // check for circular dependency
  const currentNote = getNote(currentNoteId);

  // test candidate isn't part of the tree, we don't care if there's a circle somewhere else
  if (!visited.has(potentialParentId)) return false;

  if (currentNote.parentId != null && visited.has(currentNote.parentId)) {
    // we walked all nodes but we walked the parent of the last node too
    // there's a circular dependency
    return "CIRCULAR";
  }

  return true;
}

/**
 * Returns true if potentialChildId is a descendant of potentialParentId
 * @param potentialChildId
 * @param potentialParentId
 * @param notes
 * @returns "CIRCULAR" if child and parent are in a circular reference, true if is a descendant, false in all other cases
 */
export async function isDescendantAsync(
  potentialChildId: string,
  potentialParentId: string,
  getNote: (id: string) => Promise<NoteDTO | undefined | null>,
): Promise<boolean | "CIRCULAR"> {
  const visited = new Set<string>();
  if (potentialChildId === potentialParentId) return "CIRCULAR";

  let currentNoteId = potentialChildId;
  while (!visited.has(currentNoteId)) {
    const currentNote = await getNote(currentNoteId);
    if (!currentNote) return false;
    visited.add(currentNoteId);
    if (!currentNote.parentId) break;
    currentNoteId = currentNote.parentId;
  }
  // check for circular dependency
  const currentNote = await getNote(currentNoteId);
  if (!currentNote) return false;

  // test candidate isn't part of the tree, we don't care if there's a circle somewhere else
  if (!visited.has(potentialParentId)) return false;

  if (currentNote.parentId != null && visited.has(currentNote.parentId)) {
    // we walked all nodes but we walked the parent of the last node too
    // there's a circular dependency
    return "CIRCULAR";
  }

  return true;
}

export type NoteExportFormat = "md" | "html" | "json";
export const FileFormatMap: Record<NoteExportFormat, string> = {
  html: "HTML document",
  json: "JSON document",
  md: "Markdown document",
};

export type NoteImportResult = {
  type: NoteExportFormat;
  content: string[];
};

export type OrderKey = "favoriteOrderHint";
export type ParentId = string | null;
export type MovePlacement = "inside-start" | "inside-end" | "below";

/** 📄*/
export const DEFAULT_NOTE_ICON = "1f4c4";

/** Remove all newlines from a note's title. They will be replaced with whitespace characters. */
export function cleanNoteTitle(title: string) {
  return title.replace(/(\r\n|\n|\r)/gm, " ");
}
