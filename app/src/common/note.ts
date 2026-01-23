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

export function isDescendant(
  id: string,
  potentialParentId: string,
  notes: Record<string, NoteDTO>,
): boolean {
  if (id === potentialParentId) return true;
  let currentNote = id;
  while (notes[currentNote] && notes[currentNote].parentId != null) {
    if (notes[currentNote].parentId === potentialParentId) return true;
    currentNote = notes[currentNote].parentId as string;
    if (currentNote === id) break; // prevent circular reference
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
