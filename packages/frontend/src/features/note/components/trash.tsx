import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { navigateToNote } from "@/features/navigation/navigator";
import { SidebarItem } from "@/features/sidebar/sidebar-item";
import { cn, getNoteIcon } from "@/lib/utils";
import { Trash, Undo2 } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNoteById } from "../hooks/use-note-by-id";
import { useTrash } from "../hooks/use-trash";
import { useNoteActions } from "../store/note-actions";
import { TrashMenu } from "./trash-menu";

type TrashItemProps = {
  noteId: string;
  className?: string;
};

const TrashItem = memo(function ({ noteId, className }: TrashItemProps) {
  const { note } = useNoteById(noteId);
  const { t } = useTranslation();
  const { restoreFromTrash, permanentlyDeleteNote } = useNoteActions();
  if (!note) return null;

  return (
    <div
      tabIndex={0}
      onClick={() => navigateToNote(noteId)}
      className={cn(
        "grid grid-cols-[24px_1fr_32px_32px] gap-1 items-center pr-1 pl-2 py-1 rounded-lg hover:bg-secondary/50 transition-colors duration-100",
        className,
      )}
    >
      <span>{getNoteIcon(note.icon)}</span>
      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-start">
        {note.title}
      </span>
      <Button
        title={t("sidebar.trash.restore")}
        onClick={(e) => {
          e.stopPropagation();
          restoreFromTrash(noteId);
        }}
        variant={"ghost"}
        className="w-8 h-8 p-0"
      >
        <Undo2 className="size-4" />
      </Button>
      <Button
        title={t("sidebar.trash.delete")}
        onClick={(e) => {
          e.stopPropagation();
          permanentlyDeleteNote(noteId);
        }}
        variant={"destructive"}
        className="w-8 h-8 p-0 bg-transparent text-destructive hover:bg-destructive/25 border-none"
      >
        <Trash className="size-4" />
      </Button>
    </div>
  );
});

export function TrashWidget() {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  const { noteIds } = useTrash(query);
  const items = useMemo(() => {
    return noteIds.map((id) => <TrashItem noteId={id} key={id} />);
  }, [noteIds]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarItem>
          <Trash size={18} />
          <span>{t("sidebar.button.trash")}</span>
        </SidebarItem>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sticky="always"
        className="w-80 ml-2 grid grid-rows-[auto_1fr] bg-view-2/80 top-highlight max-h-[60vh] p-0 mb-2"
      >
        <div className="p-2 flex gap-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("sidebar.trash.search")}
            className="bg-secondary/50 top-highlight border-border/25"
          />
          <TrashMenu />
        </div>
        <div className="h-full overflow-y-auto flex flex-col scroll-view pl-2 pr-1 gutter-stable pt-0 pb-2 w-full">
          {items.length > 0 ? (
            items
          ) : (
            <span className="p-4 flex items-center justify-center text-foreground/70 font-medium">
              {t("search.noResult")}
            </span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
