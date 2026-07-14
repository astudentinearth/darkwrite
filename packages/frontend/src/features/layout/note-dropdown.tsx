import { IconSlash } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNoteFromURL } from "@/features/note/hooks/use-note-from-url";
import { cn, getNoteIcon, getNoteIcon2 } from "@/lib/utils";
import { navigateToNote } from "../navigation/navigator";
import { useNoteById } from "../note/hooks/use-note-by-id";
import { selectParentIdTree } from "../note/store/note-selectors";
import { useAppSelector } from "../store/hooks";
import TitlebarNavTrigger from "./titlebar-nav-trigger";

function ParentItem(props: { id: string; setOpen: (open: boolean) => void }) {
  const { note } = useNoteById(props.id);
  const { setOpen } = props;
  const { t } = useTranslation();
  if (!note) return null;
  return (
    <Button
      variant={"ghost"}
      className="h-fit gap-2 w-full justify-start px-1.5 py-1"
      onClick={() => {
        setOpen(false);
        navigateToNote(props.id);
      }}
    >
      <span>{getNoteIcon2(note.icon, note.type)}</span>
      <span>{note.title || t("defaults.pageTitle")}</span>
    </Button>
  );
}

export default function NoteDropdown({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const currentNote = useNoteById(id).note;
  const tree = useAppSelector((state) => selectParentIdTree(state, id ?? ""));
  if (!currentNote) return null;
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <TitlebarNavTrigger
          className={cn(
            "max-w-64 overflow-hidden select-none",
            open && "bg-secondary/50",
          )}
        >
          <span>{getNoteIcon2(currentNote.icon, currentNote.type)}</span>
          <span className="overflow-hidden w-full text-ellipsis whitespace-nowrap wrap-break-word">
            {currentNote.title || t("defaults.pageTitle")}
          </span>
        </TitlebarNavTrigger>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="flex items-center">
        {tree?.map((n) => (
          <>
            <ParentItem key={n} id={n} setOpen={setOpen} />
            <IconSlash
              size={16}
              key={`${n}-sep`}
              className="shrink-0 text-muted-foreground opacity-50"
            />
          </>
        ))}
        {tree.length === 0 ? (
          <span className="text-foreground/80 block px-4 py-2">
            {t("titlebar.noPagesAbove")}
          </span>
        ) : (
          <ParentItem id={currentNote.id} setOpen={setOpen} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
