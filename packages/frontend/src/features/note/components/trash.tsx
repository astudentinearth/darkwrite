import { IconTrash } from "@tabler/icons-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Trash, Undo2 } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
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
import { useAppDispatch, useAppStore } from "@/features/store/hooks";
import { cn, getNoteIcon } from "@/lib/utils";
import { useNoteById } from "../hooks/use-note-by-id";
import { useTrash } from "../hooks/use-trash";
import {
  restoreFailToast,
  restoreSuccessToast,
  trashFailToast,
  trashSuccessToast,
} from "../note.toast";
import {
  moveToTrash,
  permanentlyDeleteNote,
  restoreFromTrash,
} from "../store/note.thunk";
import { getMovingNote } from "../store/note-selectors";
import { NoteTitle } from "./note-title";
import { TrashMenu } from "./trash-menu";

type TrashItemProps = {
  noteId: string;
  className?: string;
};

const TrashItem = memo(function ({ noteId, className }: TrashItemProps) {
  const { note } = useNoteById(noteId);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
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
      <span>{getNoteIcon(note.icon)}</span>
      <NoteTitle className="whitespace-nowrap text-ellipsis overflow-hidden text-start">
        {note.title}
      </NoteTitle>
      <TextTooltip text={t("sidebar.trash.restore")}>
        <Button
          aria-label={t("sidebar.trash.restore")}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(restoreFromTrash(noteId))
              .andTee(restoreSuccessToast)
              .orTee(restoreFailToast);
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
            dispatch(permanentlyDeleteNote(noteId));
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

function TrashList({ query }: { query: string }) {
  const { noteIds } = useTrash(query);
  const parentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const virtual = useVirtualizer({
    count: noteIds.length,
    estimateSize: () => 32,
    getScrollElement: () => parentRef.current,
    getItemKey: (i) => noteIds[i],
    overscan: 5,
  });

  useEffect(() => {
    virtual.scrollToIndex(0);
  }, [query]);

  if (noteIds.length === 0)
    return (
      <span className="p-4 flex justify-center items-center">
        {t("search.noResult")}
      </span>
    );

  return (
    <div
      ref={parentRef}
      className="h-full overflow-y-auto scroll-view pl-1 pr-1 gutter-stable pt-0 pb-1 w-full"
    >
      <div style={{ height: virtual.getTotalSize(), position: "relative" }}>
        {virtual.getVirtualItems().map((v) => (
          <div
            key={v.key}
            style={{
              height: v.size,
              transform: `translateY(${v.start}px)`,
            }}
            className="absolute top-0 left-0 w-full"
          >
            <TrashItem noteId={v.key.toString()} />
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const store = useAppStore();

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
            if (note)
              store
                .dispatch(moveToTrash(note.id))
                .andTee(trashSuccessToast)
                .orTee(trashFailToast);
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
        className="w-80 ml-2 grid grid-rows-[auto_1fr] bg-view-2/80 top-highlight max-h-[60vh] min-h-120 p-0 mb-2"
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
        <TrashList query={query} />
      </PopoverContent>
    </Popover>
  );
}
