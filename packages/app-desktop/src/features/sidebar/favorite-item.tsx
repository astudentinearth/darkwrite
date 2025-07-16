import { Note } from "@darkwrite/common/models";
import { Draggable } from "@hello-pangea/dnd";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@darkwrite/ui";
import { useUpdateNoteMutation } from "@/hooks/query";
import { useExport } from "@/hooks/use-export";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";
import { useNoteFromURL } from "@/hooks/use-note-from-url";
import { cn, getNoteIcon } from "@/lib/utils";
import { ArrowRightFromLine, Star, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export function FavoriteItem({ note, index }: { note: Note; index: number }) {
  const [active, setActive] = useState(false);
  const navToNote = useNavigateToNote();
  const update = useUpdateNoteMutation().mutate;
  const trash = (id: string) => update({ id, dto: { isTrashed: true } });
  const activeNoteId = useNoteFromURL();
  const _export = useExport();
  useEffect(() => {
    if (!activeNoteId || activeNoteId !== note.id) setActive(false);
    else setActive(true);
  }, [note.id, activeNoteId]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Draggable draggableId={note.id} index={index}>
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              onClick={() => {
                navToNote(note.id);
              }}
              className={cn(
                "rounded-[8px] cursor-default! duration-100 note-item hover:bg-secondary/50 hover:text-foreground font-medium active:bg-secondary/25 transition-colors grid grid-cols-[20px_24px_1fr] select-none p-1 h-8 overflow-hidden",
                active
                  ? "text-foreground bg-secondary/80"
                  : "text-foreground/60",
              )}
            >
              <div></div>
              <div className="flex w-6 h-6 items-center justify-center text-[18px] translate-y-[-5%]">
                {getNoteIcon(note.icon)}
              </div>
              <span
                className={cn(
                  "text-ellipsis whitespace-nowrap block overflow-hidden text-sm self-center pl-1",
                )}
              >
                {note.title}
              </span>
            </div>
          )}
        </Draggable>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-fit">
        <ContextMenuItem
          onClick={() => {
            update({
              id: note.id,
              dto: {
                isFavorite: !note.isFavorite,
                //favoriteIndex: 0,
              },
            });
          }}
        >
          <Star
            className={cn(
              note.isFavorite ? "text-star fill-star" : "opacity-75",
            )}
            size={20}
          ></Star>
          &nbsp;{" "}
          {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            //TODO FIX FOR MIGRATION
            //_export(note);
          }}
        >
          <ArrowRightFromLine
            className="opacity-75"
            size={20}
          ></ArrowRightFromLine>
          &nbsp; Export
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            trash(note.id);
          }}
          className="focus:text-destructive focus:*:text-destructive group"
        >
          <Trash
            className="opacity-75 group-focus:text-destructive"
            size={20}
          ></Trash>
          &nbsp; Move to trash
        </ContextMenuItem>
        <ContextMenuSeparator></ContextMenuSeparator>
        <span className="text-foreground/50 text-sm p-2">
          Last edited: {note.modifiedAt.toLocaleString()}
        </span>
      </ContextMenuContent>
    </ContextMenu>
  );
}
