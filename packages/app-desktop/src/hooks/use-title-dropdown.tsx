import { NoteDTO, resolveParents } from "@darkwrite/common";
import { getNoteIcon } from "@/lib/utils";
import { ChevronDown, Home, Settings } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNotesQuery } from "./query";
import { useNoteFromURL } from "./use-note-from-url";

export function getTitle(
  notes: NoteDTO[] | undefined,
  isLoading: boolean,
  path: string,
  pageId: string | undefined,
) {
  if (pageId == null && !path.startsWith("/page")) {
    switch (path) {
      case "/": {
        return (
          <>
            <Home size={18} />
            &nbsp;Home
          </>
        );
      }
      case "/settings": {
        return (
          <>
            <Settings size={18} />
            &nbsp;Settings
          </>
        );
      }
      default:
        return "";
    }
  } else {
    if (notes == null || isLoading) {
      return "Loading";
    }
    const note = notes.find((n) => n.id === pageId);
    if (note) {
      return (
        <>
          <ChevronDown size={18} />
          <div className="text-lg translate-y-[-5%]">
            {getNoteIcon(note.icon)}
          </div>
          {note.title}
        </>
      );
    } else return "";
  }
}

export function resolveUpperTree(notes: NoteDTO[], id: string): NoteDTO[] {
  const note = notes.find((n) => n.id === id);
  if (!note || !note.parentId) return [];
  const nodes: NoteDTO[] = resolveParents(id, notes);
  return nodes;
}

export const useTitleDropdown = () => {
  const id = useNoteFromURL();
  const location = useLocation();
  const { data: notesQuery, isLoading } = useNotesQuery();
  const notes = notesQuery;

  const [parentNodes, setParentNodes] = useState<NoteDTO[]>([]);
  const [title, setTitle] = useState<ReactNode>("Darkwrite");

  useEffect(() => {
    const path = location.pathname;
    const title = getTitle(notes ?? undefined, isLoading, path, id);
    setTitle(title);
  }, [id, isLoading, location.pathname, notes]);

  useEffect(() => {
    const path = location.pathname;
    if (!path.startsWith("/page") || !notes || !id) setParentNodes([]);
    else setParentNodes(resolveUpperTree(notes, id));
  }, [location, notes, isLoading, id]);
  return { parentNodes, title };
};
