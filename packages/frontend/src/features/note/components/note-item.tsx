import { ChevronRight, Plus } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { TextTooltip } from "@/components/ui/tooltip";
import { navigateToNote } from "@/features/navigation/navigator";
import { appSessionSlice } from "@/features/session/session-slice";
import { useAppDispatch } from "@/features/store/hooks";
import { cn, getNoteIcon } from "@/lib/utils";
import { useNoteById } from "../hooks/use-note-by-id";
import { useNoteFromURL } from "../hooks/use-note-from-url";
import { DropPosition, useNoteItemDnD } from "../hooks/use-note-item-drag";
import { NoteContextMenuContainer } from "../note-context-menu";
import { createNote } from "../store/note.thunk";
import type { NoteTreeItem } from "../store/notes-ui-selectors";
import { notesUiSlice } from "../store/notes-ui-slice";
import { NoteTitle } from "./note-title";

export type NoteItemProps = {
  item: NoteTreeItem;
} & React.ComponentProps<"div">;

function HeadingItem({ item, className, ...props }: NoteItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    const action =
      item.type === "allNotesHeading"
        ? appSessionSlice.actions.setAllNotesViewOpen
        : appSessionSlice.actions.setFavoritesViewOpen;
    dispatch(action(!item.expanded));
  };

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className={cn(
        "group flex justify-start text-start place-items-start select-none w-full items-center gap-2 rounded-md text-sm hover:bg-secondary/50 p-1.5 pl-2  hover:opacity-100 opacity-75 duration-75 transition-opacity active:pushdown-98% active:opacity-90",
        className,
      )}
      {...props}
    >
      <span>
        {t(
          item.type === "allNotesHeading"
            ? "sidebar.title.allNotes"
            : "sidebar.title.favorites",
        )}
      </span>
      <ChevronRight
        className={cn(
          "size-4 transition-transform duration-100 place-self-center",
          item.expanded && "rotate-90",
        )}
      />
    </div>
  );
}

function CreateNew({ item, className, ...props }: NoteItemProps) {
  const { t } = useTranslation();

  return (
    <div
      style={{ paddingLeft: `${6 + item.depth * 6}px` }}
      className={cn(
        "text-start select-none active:pushdown-99% w-full items-center gap-2 rounded-md text-sm p-1.5 opacity-50",
        className,
      )}
      {...props}
    >
      <span>{t("sidebar.notes.noPages")}</span>
    </div>
  );
}

const positionToClassName: Record<DropPosition, string> = {
  [DropPosition.Top]: "dnd-top-edge",
  [DropPosition.Center]: "bg-primary/10",
  [DropPosition.Bottom]: "dnd-bottom-edge",
};

export function NoteItem({ item, className, ...props }: NoteItemProps) {
  const { note } = useNoteById(item.id);
  const activeNoteId = useNoteFromURL();
  const dispatch = useAppDispatch();
  const {
    onDragLeave,
    onDragEnter,
    onDragOver,
    isDraggingOver,
    position,
    onDrag,
    onDrop,
  } = useNoteItemDnD(item);
  const { t } = useTranslation();
  if (item.type === "allNotesHeading" || item.type === "favoriteHeading")
    return <HeadingItem {...{ item, className, ...props }} />;
  if (item.type === "spacer") return <div className="h-2" />;
  if (item.type === "createNew")
    return <CreateNew {...{ item, className, ...props }} />;

  if (!note) return null;

  const toggleCollapsed = () => {
    const action =
      item.type === "favorite"
        ? item.expanded
          ? notesUiSlice.actions.collapseFavorite
          : notesUiSlice.actions.expandFavorite
        : item.expanded
          ? notesUiSlice.actions.collapseNote
          : notesUiSlice.actions.expandNote;

    dispatch(action(item.id));
  };

  return (
    <NoteContextMenuContainer noteId={item.id}>
      <div
        draggable
        onDrop={onDrop}
        onDragStart={onDrag}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        tabIndex={0}
        style={{ paddingLeft: `${6 + item.depth * 6}px` }}
        onClick={() => navigateToNote(item.id)}
        className={cn(
          "group grid grid-cols-[20px_1fr] select-none active:pushdown-99% hover:grid-cols-[20px_1fr_20px] w-full items-center gap-2 rounded-md text-sm hover:bg-secondary/50 p-1.5 focus:outline-0 focus-visible:bg-secondary/70",
          activeNoteId === item.id && "bg-secondary/40",
          isDraggingOver && position ? positionToClassName[position] : null,
          className,
        )}
        {...props}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapsed();
          }}
          className="flex items-center gap-1 rounded-[6px] justify-center size-5 hover:bg-muted/50"
        >
          <ChevronRight
            className={cn(
              "size-4 transition-transform duration-100 hidden group-hover:block",
              item.expanded && "rotate-90",
            )}
          />
          <span className="flex group-hover:hidden">
            {getNoteIcon(note.icon, "size-4")}
          </span>
        </button>
        <NoteTitle className="flex-1 truncate text-left select-none opacity-75 group-hover:opacity-100">
          {note.title}
        </NoteTitle>{" "}
        <TextTooltip text={t("sidebar.notes.contextmenu.newSubpage")}>
          <button
            onClick={() => {
              dispatch(createNote({ parentId: item.id, navigateAfter: true }));
              dispatch(notesUiSlice.actions.expandNote(item.id));
            }}
            className={cn(
              "hover:bg-secondary/50 size-5 group-hover:opacity-100 rounded-[6px] group-hover:flex hidden justify-center items-center",
              isDraggingOver && "hidden",
            )}
          >
            <Plus className="size-4" />
          </button>
        </TextTooltip>
      </div>
    </NoteContextMenuContainer>
  );
}
