import { ChevronRight, Plus } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { appSessionSlice } from "@/features/session/session-slice";
import { useAppDispatch } from "@/features/store/hooks";
import { cn, getNoteIcon } from "@/lib/utils";
import { useNoteById } from "../hooks/use-note-by-id";
import { NoteContextMenuContainer } from "../note-context-menu";
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
    <button
      tabIndex={0}
      onClick={handleClick}
      className={cn(
        "group grid grid-cols-[20px_1fr] justify-start text-start place-items-start select-none active:pushdown-99% w-full items-center gap-2 rounded-md text-sm hover:bg-secondary/50 p-1.5",
        className,
      )}
      {...props}
    >
      <ChevronRight
        className={cn(
          "size-4 transition-transform duration-100 place-self-center",
          item.expanded && "rotate-90",
        )}
      />
      <span>
        {t(
          item.type === "allNotesHeading"
            ? "sidebar.title.allNotes"
            : "sidebar.title.favorites",
        )}
      </span>
    </button>
  );
}

function CreateNew({ item, className, ...props }: NoteItemProps) {
  const { t } = useTranslation();
  const handleClick = () => {};

  return (
    <button
      tabIndex={0}
      style={{ paddingLeft: `${6 + item.depth * 6}px` }}
      onClick={handleClick}
      className={cn(
        "group grid grid-cols-[20px_1fr] text-start select-none active:pushdown-99% w-full items-center gap-2 rounded-md text-sm hover:bg-secondary/50 p-1.5 opacity-70 hover:opacity-100",
        className,
      )}
      {...props}
    >
      <Plus
        className={cn(
          "size-4 transition-transform duration-100 place-self-center",
        )}
      />
      <span>{t("home.createPage")}</span>
    </button>
  );
}

export function NoteItem({ item, className, ...props }: NoteItemProps) {
  const { note } = useNoteById(item.id);
  const dispatch = useAppDispatch();
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
        tabIndex={0}
        style={{ paddingLeft: `${6 + item.depth * 6}px` }}
        className={cn(
          "group grid grid-cols-[20px_1fr] select-none active:pushdown-99% hover:grid-cols-[20px_1fr_20px] w-full items-center gap-2 rounded-md text-sm hover:bg-secondary/50 p-1.5",
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
        </NoteTitle>
      </div>
    </NoteContextMenuContainer>
  );
}
