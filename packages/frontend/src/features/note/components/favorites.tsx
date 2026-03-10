import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";
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
      {items}
    </div>
  );
}
