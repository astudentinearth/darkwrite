import { NoteDTO } from "./dto";

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
 * @returns
 */
export function isDescendant(
  potentialChildId: ParentId,
  potentialParentId: string,
  notes: Record<string, NoteDTO>,
): boolean {
  if (potentialChildId == null) return false;
  if (potentialChildId === potentialParentId) return true;
  let currentNoteId = potentialChildId;
  while (notes[currentNoteId] && notes[currentNoteId]?.parentId != null) {
    const currentNote = notes[currentNoteId];
    if (!currentNote) break;
    if (currentNote.parentId === potentialParentId) return true;
    currentNoteId = currentNote.parentId as string;
    if (currentNoteId === potentialChildId) break; // prevent circular reference
  }
  return false;
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

export type OrderKey = "orderHint" | "favoriteOrderHint";
export type ParentId = string | null;
export type MovePlacement = "inside-start" | "inside-end" | "below";
