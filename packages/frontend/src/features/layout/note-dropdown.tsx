import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNoteIcon } from "@/lib/utils";
import { useNoteFromURL } from "@/features/note/hooks/use-note-from-url";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { navigateToNote } from "../navigation/navigator";
import { useNoteById } from "../note/hooks/use-note-by-id";
import { selectParentIdTree } from "../note/store/note-selectors";
import { useAppSelector } from "../store/hooks";
import TitlebarNavTrigger from "./titlebar-nav-trigger";

function ParentItem(props: { id: string; setOpen: (open: boolean) => void }) {
  const { note } = useNoteById(props.id);
  const { setOpen } = props;
  if (!note) return null;
  return (
    <Button
      variant={"ghost"}
      className="h-fit gap-2 w-full justify-start px-2"
      onClick={() => {
        setOpen(false);
        navigateToNote(props.id);
      }}
    >
      <span>{getNoteIcon(note.icon)}</span>
      <span>{note.title}</span>
    </Button>
  );
}

export default function NoteDropdown() {
  const [open, setOpen] = useState(false);
  const id = useNoteFromURL();
  const { t } = useTranslation();
  const currentNote = useNoteById(id).note;
  const tree = useAppSelector((state) => selectParentIdTree(state, id ?? ""));
  if (!currentNote) return null;
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <TitlebarNavTrigger className="max-w-64 overflow-hidden">
          <span>{getNoteIcon(currentNote.icon)}</span>
          <span className="overflow-hidden w-full text-ellipsis whitespace-nowrap wrap-break-word">
            {currentNote.title || t("defaults.pageTitle")}
          </span>
        </TitlebarNavTrigger>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {tree?.map((n) => (
          <ParentItem key={n} id={n} setOpen={setOpen} />
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
