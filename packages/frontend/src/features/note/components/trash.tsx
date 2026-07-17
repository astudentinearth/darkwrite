import { IconTrash } from "@tabler/icons-react";
import { Trash, Trash2, Undo2 } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { TextTooltip } from "@/components/ui/tooltip";
import { useDragState } from "@/features/dnd/use-drag-state";
import { navigateToNote } from "@/features/navigation/navigator";
import { SidebarItem } from "@/features/sidebar/sidebar-item";
import { useAppStore } from "@/features/store/hooks";
import { cn, getNoteIcon2 } from "@/lib/utils";
import { useNoteById } from "../hooks/use-note-by-id";
import { useTrash } from "../hooks/use-trash";
import { getMovingNote } from "../store/move-note";
import { useNoteActions } from "../store/note-actions";
import { NoteTitle } from "./note-title";
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
        "grid grid-cols-[24px_1fr_24px_24px] gap-1 items-center pr-1 pl-2 py-1 rounded-lg hover:bg-background/50 dark:hover:bg-secondary/50 transition-colors duration-100",
        className,
      )}
    >
      <span>{getNoteIcon2(note.icon, note.type)}</span>
      <NoteTitle className="whitespace-nowrap text-ellipsis overflow-hidden text-start">
        {note.title}
      </NoteTitle>
      <TextTooltip text={t("sidebar.trash.restore")}>
        <Button
          aria-label={t("sidebar.trash.restore")}
          onClick={(e) => {
            e.stopPropagation();
            restoreFromTrash(noteId);
          }}
          variant={"ghost"}
          className="w-6 h-6 p-0"
        >
          <Undo2 className="size-4" />
        </Button>
      </TextTooltip>
      <TextTooltip text={t("sidebar.trash.delete")}>
        <Button
          aria-label={t("sidebar.trash.delete")}
          onClick={(e) => {
            e.stopPropagation();
            permanentlyDeleteNote(noteId);
          }}
          variant={"destructive"}
          className="w-6 h-6 p-0 bg-transparent text-destructive hover:bg-destructive/25 border-none"
        >
          <Trash className="size-4" />
        </Button>
      </TextTooltip>
    </div>
  );
});

export function TrashWidget() {
  const [query, setQuery] = useState("");

  const {
    isDraggingOver,
    onDragEnter,
    onDragLeave,
    onDragOver,
    setIsDraggingOver,
  } = useDragState();

  const { t } = useTranslation();
  const { noteIds } = useTrash(query);
  const store = useAppStore();
  const actions = useNoteActions();
  const items = useMemo(() => {
    return noteIds.map((id) => <TrashItem noteId={id} key={id} />);
  }, [noteIds]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarItem
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={(e) => {
            setIsDraggingOver(false);
            const note = getMovingNote(e, store.getState());
            if (note) actions.moveToTrash(note.id);
          }}
          className={cn("col-span-2", isDraggingOver && "bg-destructive/20")}
        >
          <IconTrash size={18} />
          <span>
            {t(
              isDraggingOver
                ? "sidebar.notes.contextmenu.trash"
                : "sidebar.button.trash",
            )}
          </span>
        </SidebarItem>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sticky="always"
        className="w-80 ml-2 grid grid-rows-[auto_1fr] bg-view-2/80 top-highlight max-h-[60vh] p-0 mb-2"
      >
        <div className="p-1 flex gap-0.5">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("sidebar.trash.search")}
            className="bg-secondary/50 rounded-lg top-highlight border-border/25"
          />
          <TrashMenu />
        </div>
        <div className="h-full overflow-y-auto flex flex-col scroll-view pl-1 pr-1 gutter-stable pt-0 pb-1 w-full">
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
