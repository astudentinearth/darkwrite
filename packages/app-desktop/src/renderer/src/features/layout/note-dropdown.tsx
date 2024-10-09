import { Note, resolveParents } from "@darkwrite/common";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { useNotesStore } from "@renderer/context/notes-context";
import { useNavigateToNote } from "@renderer/hooks/use-navigate-to-note";
import { fromUnicode } from "@renderer/lib/utils";
import { ChevronDown, Home, Settings } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

export function NoteDropdown() {
  const [search] = useSearchParams();
  const location = useLocation();
  const navToNote = useNavigateToNote();
  const notes = useNotesStore((state) => state.notes);
  const [parentNodes, setParentNodes] = useState<Note[]>([]);
  const [title, setTitle] = useState<ReactNode>("Darkwrite");
  useEffect(() => {
    const id = search.get("id");
    const path = location.pathname;
    const resolveUpperTree = (note: Note) => {
      if (note.parentID == null) setParentNodes([]);
      const nodes: Note[] = resolveParents(note.id, notes);
      setParentNodes(nodes);
    };
    if (id == null && path !== "/page") {
      switch (path) {
        case "/": {
          setTitle(
            <>
              <Home size={18} />
              &nbsp;Home
            </>,
          );
          break;
        }
        case "/settings": {
          setTitle(
            <>
              <Settings size={18} />
              &nbsp;Settings
            </>,
          );
          break;
        }
      }
      setParentNodes([]);
    } else {
      // set title
      const note = notes.find((n) => n.id === id);
      if (note) {
        resolveUpperTree(note);
        setTitle(
          <>
            <ChevronDown size={18} />
            <div className="text-lg translate-y-[-5%]">
              {fromUnicode(note.icon)}
            </div>
            {note.title}
          </>,
        );
      }
    }
  }, [search, location, notes]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="px-2 h-auto gap-0.5 [&>span]:leading-[18px]"
        >
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {parentNodes.map((n) => (
          <DropdownMenuItem
            key={n.id}
            onClick={() => navToNote(n.id)}
            className="[&>span]:leading-[18px]"
          >
            <div className="text-lg translate-y-[-5%]">
              {fromUnicode(n.icon)}
            </div>
            {n.title}
          </DropdownMenuItem>
        ))}
        {parentNodes.length === 0 ? (
          <span className="text-sm text-foreground/50 p-2 inline-block">
            No pages above
          </span>
        ) : (
          <></>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
