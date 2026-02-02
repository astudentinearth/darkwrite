import { resolveUpperTree } from "@/common/note";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";
import { getNoteIcon } from "@/lib/utils";
import { useNoteFromURL } from "@/query/use-note-from-url";
import { useNotes } from "@/query/use-notes";
import TitlebarNavTrigger from "./titlebar-nav-trigger";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function NoteDropdown() {
  const [open, setOpen] = useState(false);
  const id = useNoteFromURL();
  const { t } = useTranslation();
  const nav = useNavigateToNote();
  const { notes } = useNotes();
  if (!id || !notes) return <></>;
  const currentNote = notes[id];
  if (!currentNote) return <></>;
  const tree = resolveUpperTree(id, notes);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <TitlebarNavTrigger className="max-w-64 overflow-hidden">
          <span>{getNoteIcon(currentNote.icon)}</span>
          <span className="overflow-hidden w-full text-ellipsis whitespace-nowrap wrap-break-word">
            {currentNote.title}
          </span>
        </TitlebarNavTrigger>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {tree?.map((n) => (
          <Button
            variant={"ghost"}
            key={n.id}
            className="h-fit gap-2 w-full justify-start px-2"
            onClick={() => {
              setOpen(false);
              nav(n.id);
            }}
          >
            <span>{getNoteIcon(n.icon)}</span>
            <span>{n.title}</span>
          </Button>
        ))}
        {tree.length == 0 && (
          <span className="text-foreground/80 block px-4 py-2">
            {t("titlebar.noPagesAbove")}
          </span>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
