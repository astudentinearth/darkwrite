import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useFavoriteDropZone } from "../hooks/use-favorite-reorder";
import { useFavorites } from "../hooks/use-favorites";
import NoteList from "./note-list";
import { NoteItem } from "./note-list-item";

interface FavoriteItemProps {
  noteId: string;
  children?: React.ReactNode;
}

export const FavoriteDropZone = memo(function (props: {
  aboveId: string | null;
}) {
  const { isDraggingOver, onDragEnter, onDragLeave, onDragOver, onDrop } =
    useFavoriteDropZone(props.aboveId);

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn("h-1", isDraggingOver && "bg-star/20")}
    ></div>
  );
});

export function FavoriteItem(props: FavoriteItemProps) {
  return (
    <>
      <NoteItem id={props.noteId}>
        <NoteList parentId={props.noteId} />
      </NoteItem>
      <FavoriteDropZone aboveId={props.noteId} />
    </>
  );
}

const EmptyState = () => {
  const { t } = useTranslation();
  const { onDragEnter, onDragLeave, onDragOver, isDraggingOver, onDrop } =
    useFavoriteDropZone(null);

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "border border-dashed rounded-lg flex items-center text-center text-xs p-2 select-none",
        isDraggingOver && "bg-star/5 border-star/10",
      )}
    >
      {t("sidebar.favorites.emptyHint")}
    </div>
  );
};

export function FavoritesView() {
  const { noteIds } = useFavorites();

  const items = useMemo(() => {
    return noteIds.map((noteId) => (
      <FavoriteItem key={noteId} noteId={noteId} />
    ));
  }, [noteIds]);

  return (
    <div>
      <FavoriteDropZone aboveId={null} />
      {items.length > 0 ? items : <EmptyState />}
    </div>
  );
}
