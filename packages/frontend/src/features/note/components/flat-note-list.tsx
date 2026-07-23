import { NoteType } from "@darkwrite/common";
import { ChevronRight, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TextTooltip } from "@/components/ui/tooltip";
import { navigateToNote } from "@/features/navigation/navigator";
import { useSessionActions } from "@/features/session/session-actions";
import {
  selectAllNotesViewOpen,
  selectFavoritesViewOpen,
} from "@/features/session/session-selectors";
import { selectCompactSidebar } from "@/features/settings/store/settings-selectors";
import { SidebarItem } from "@/features/sidebar/sidebar-item";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { cn, getNoteIcon2 } from "@/lib/utils";
import { useNoteItem, useNoteItemDrag } from "../hooks/use-note-item";
import { NoteContextMenuContainer } from "../note-context-menu";
import { useGetAllByWorkspaceIdQuery } from "../store/notes-api";
import {
  type NoteTreeItem,
  selectSidebarTree,
} from "../store/notes-ui-selectors";
import { notesUiSlice } from "../store/notes-ui-slice";
import { NoteTitle } from "./note-title";

const getPaddingPx = (depth: number) => `${depth * 8}px`;

function HeadingItem({ item }: { item: NoteTreeItem }) {
  const open = useAppSelector(
    item.type === "favoriteHeading"
      ? selectFavoritesViewOpen
      : selectAllNotesViewOpen,
  );
  const actions = useSessionActions();
  const { t } = useTranslation("translation", { keyPrefix: "sidebar" });
  const click = () => {
    if (item.type === "favoriteHeading") actions.setFavoritesViewOpen(!open);
    else actions.setAllNotesViewOpen(!open);
  };
  return (
    <SidebarItem onClick={click} className="w-full gap-1 text-xs pl-2">
      <ChevronRight
        size={16}
        className={cn("transition-transform duration-100", open && "rotate-90")}
      />
      {t(
        item.type === "favoriteHeading" ? "title.favorites" : "title.allNotes",
      )}
    </SidebarItem>
  );
}

function NoteItem({ item }: { item: NoteTreeItem }) {
  const { id, depth, expanded } = item;
  const open = !!expanded;
  const { note, isActive, createChild, draggable, acceptsDrop, expandable } =
    useNoteItem(id);
  const { t } = useTranslation();
  const { isDragging, onDrag, onDragEnter, onDragLeave, onDrop, onDragOver } =
    useNoteItemDrag(id);

  const compactMode = useAppSelector(selectCompactSidebar);
  const dispatch = useAppDispatch();
  const expand = () => {
    const action =
      item.type === "item"
        ? notesUiSlice.actions.expandNote
        : notesUiSlice.actions.expandFavorite;
    dispatch(action(item.id));
  };

  const toggle = () => {
    const action =
      item.type === "item"
        ? expanded
          ? notesUiSlice.actions.collapseNote
          : notesUiSlice.actions.expandNote
        : expanded
          ? notesUiSlice.actions.collapseFavorite
          : notesUiSlice.actions.expandFavorite;

    dispatch(action(item.id));
  };

  if (!note) return null;

  return (
    <NoteContextMenuContainer noteId={id}>
      <div
        className={cn("w-full")}
        style={{ paddingLeft: getPaddingPx(depth) }}
      >
        <div
          draggable={draggable}
          onDragStart={onDrag}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={acceptsDrop ? onDragOver : undefined}
          onClick={() => navigateToNote(id)}
          onDrop={acceptsDrop ? onDrop : undefined}
          className={cn(
            `group grid grid-cols-[20px_1fr] active:pushdown-99% hover:grid-cols-[20px_1fr_20px] w-full
          items-center gap-2 rounded-md px-1.5 py-1.5 text-sm hover:bg-secondary/50`,
            compactMode && "py-1 px-1",
            isActive && "bg-secondary/20 font-medium",
            isDragging && "bg-primary/25",
          )}
        >
          <button
            disabled={!expandable}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            className="flex items-center gap-1 rounded-[6px] justify-center size-5 hover:bg-muted/50"
          >
            {expandable && (
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-100 hidden group-hover:block",
                  open && "rotate-90",
                )}
              />
            )}
            <span className={cn("flex", expandable && "group-hover:hidden")}>
              {getNoteIcon2(note.icon, note.type, "size-4")}
            </span>
          </button>
          <NoteTitle className="flex-1 truncate text-left select-none opacity-75 group-hover:opacity-100">
            {note.title}
          </NoteTitle>
          {note.type !== NoteType.DatabaseView && (
            <TextTooltip text={t("sidebar.notes.contextmenu.newSubpage")}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  createChild(e);
                  expand();
                }}
                className={cn(
                  "hover:bg-secondary/50 size-5 group-hover:opacity-100 rounded-[6px] group-hover:flex hidden justify-center items-center",
                  isDragging && "hidden",
                )}
              >
                <Plus className="size-4" />
              </button>
            </TextTooltip>
          )}
        </div>
      </div>
    </NoteContextMenuContainer>
  );
}

export function FlatNoteList() {
  const workspaceId = useAppSelector(
    (state) => state.session.workspaceId ?? "",
  );
  useGetAllByWorkspaceIdQuery(workspaceId, { skip: !workspaceId });
  const items = useAppSelector(selectSidebarTree);
  const nodes = items.map((item) =>
    item.type === "favorite" || item.type === "item" ? (
      <NoteItem key={`${item.type}-${item.id}`} item={item} />
    ) : (
      <HeadingItem key={`${item.type}-${item.id}`} item={item} />
    ),
  );
  return <div className="flex flex-col">{nodes}</div>;
}
