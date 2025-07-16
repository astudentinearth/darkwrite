import { findSubnotes } from "@darkwrite/common";
import { Note } from "@darkwrite/common/models";
import { NoteSelectCommandDialog } from "@renderer/components/note-select-command";
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@darkwrite/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible";
import { useNotesQuery, useUpdateNoteMutation } from "@renderer/hooks/query";
import { useCreateNoteMutation } from "@renderer/hooks/query/use-create-note-mutation";
import { useDuplicateNoteMutation } from "@renderer/hooks/query/use-duplicate-note-mutation";
import { useMoveNoteMutation } from "@renderer/hooks/query/use-move-note";
import { useExport } from "@renderer/hooks/use-export";
import { useNavigateToNote } from "@renderer/hooks/use-navigate-to-note";
import { useNoteFromURL } from "@renderer/hooks/use-note-from-url";
import { cn, getNoteIcon } from "@renderer/lib/utils";
import {
  ArrowRightFromLine,
  ChevronDown,
  ChevronRight,
  Copy,
  FilePlus2,
  Forward,
  Plus,
  Star,
  Trash,
} from "lucide-react";
import { DragEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NoteDropZone } from "./note-drop-zone";
import React from "react";

/** @deprecated WHAT EVEN IS THIS */
export function NoteItem({
  note,
  noDrop,
  noDrag,
}: {
  note: Note;
  noDrop?: boolean;
  noDrag?: boolean;
}) {
  // global state
  const notes = useNotesQuery().data;
  const activeNoteId = useNoteFromURL();

  // global actions
  const createNote = useCreateNoteMutation().mutateAsync;
  const update = useUpdateNoteMutation().mutate;
  const trash = (id: string) => {
    update({ id, dto: { isTrashed: true } });
  };
  const duplicate = useDuplicateNoteMutation().mutate;
  const move = useMoveNoteMutation().mutate;
  const navToNote = useNavigateToNote();
  const _export = useExport();

  // local state
  const [subnotes, setSubnotes] = useState([] as Note[]);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (!notes) return;
    const sub = findSubnotes(note.id, notes);
    setSubnotes(sub);
  }, [notes, note.id]);

  const render = useCallback(() => {
    let target = [...subnotes];
    target = target.filter((n) => !n.isTrashed);
    const elements: React.JSX.Element[] = [];
    if (target.length === 0)
      return (
        <span className="text-sm text-foreground/50 px-2">
          {t("sidebar.notes.noPages")}
        </span>
      );
    for (let i = 0; i < target.length; i++) {
      elements.push(
        <NoteDropZone
          key={i}
          belowID={target[i].id}
          parentID={note.id}
        ></NoteDropZone>,
      );
      elements.push(
        <NoteItem
          noDrop={noDrop}
          noDrag={noDrag}
          note={target[i]}
          key={target[i].id}
        ></NoteItem>,
      );
    }
    elements.push(
      <NoteDropZone last parentID={note.id} key={"$"}></NoteDropZone>,
    );
    return elements;
  }, [subnotes, noDrag, noDrop, note.id]);

  useEffect(() => {
    if (!activeNoteId || activeNoteId !== note.id) setActive(false);
    else setActive(true);
  }, [note.id, activeNoteId]);

  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.dataTransfer.setData("note_id", note.id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    //console.log("Dropping to item");
    const data = event.dataTransfer.getData("note_id");
    if (data === note.id) {
      setDragOver(false);
      return;
    } else {
      move({ sourceId: data, destinationId: note.id });
      setDragOver(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const data = event.dataTransfer.getData("note_id");
    setDragOver(note.id !== data);
  };

  const newSubnote = async () => {
    const sub = await createNote(note.id);
    if (sub) {
      navToNote(sub.id);
      setOpen(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };
  const handleDragEnd = () => {
    setDragOver(false);
  };

  return (
    <ContextMenu>
      <NoteSelectCommandDialog
        open={moveDialogOpen}
        setOpen={setMoveDialogOpen}
        onSelect={(n) => {
          move({ sourceId: note.id, destinationId: n.id });
        }}
      />
      <ContextMenuTrigger>
        <Collapsible open={open} onOpenChange={setOpen}>
          <div
            draggable
            tabIndex={0}
            onDragStart={noDrag ? () => {} : handleDragStart}
            onDrop={noDrop ? () => {} : handleDrop}
            onDragEnd={noDrag ? () => {} : handleDragEnd}
            onDragLeave={noDrag ? () => {} : handleDragLeave}
            onDragOver={noDrag ? () => {} : handleDragOver}
            onClick={() => {
              navToNote(note.id);
            }}
            className={cn(
              "rounded-[8px] group duration-100 note-item hover:bg-secondary/50 hover:text-foreground font-medium active:bg-secondary/25 transition-colors grid grid-cols-[20px_24px_1fr] hover:grid-cols-[20px_24px_1fr_24px] select-none p-1 h-8 overflow-hidden",
              active ? "text-foreground bg-secondary/80" : "text-foreground/60",
              dragOver && " outline-dashed outline-border outline-1",
            )}
          >
            <CollapsibleTrigger
              onClick={(e) => {
                e.stopPropagation();
              }}
              tabIndex={0}
            >
              <div className="w-5 h-5 hover:bg-secondary/50 rounded-[4px]  justify-center items-center flex">
                {open ? (
                  <ChevronDown size={14}></ChevronDown>
                ) : (
                  <ChevronRight size={14}></ChevronRight>
                )}
              </div>
            </CollapsibleTrigger>
            <div className="flex w-6 h-6 items-center justify-center leading-[18px] text-[18px] align-middle translate-y-[-5%]">
              {getNoteIcon(note.icon)}
            </div>
            <span
              className={cn(
                "text-ellipsis whitespace-nowrap block overflow-hidden text-sm self-center pl-1",
              )}
            >
              {note.orderHint}
            </span>
            <Button
              className="justify-self-end btn-add size-6 p-0 hidden group-hover:flex"
              variant={"ghost"}
              onClick={(e) => {
                e.stopPropagation();
                newSubnote();
              }}
            >
              {<Plus size={18}></Plus>}
            </Button>
          </div>
          <CollapsibleContent className="pl-2 flex flex-col">
            {render()}
          </CollapsibleContent>
        </Collapsible>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            update({
              id: note.id,
              dto: { isFavorite: !note.isFavorite },
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
          {note.isFavorite
            ? t("sidebar.notes.contextmenu.removeFavorite")
            : t("sidebar.notes.contextmenu.addFavorite")}
        </ContextMenuItem>
        <ContextMenuItem onClick={newSubnote}>
          <FilePlus2 className="opacity-75" size={20}></FilePlus2> &nbsp;{" "}
          {t("sidebar.notes.contextmenu.newSubpage")}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => setMoveDialogOpen(true)}>
          <Forward className="opacity-75" size={20}></Forward>&nbsp;{" "}
          {t("sidebar.notes.contextmenu.moveTo")}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => duplicate(note.id)}>
          <Copy className="opacity-75" size={20}></Copy>&nbsp;{" "}
          {t("sidebar.notes.contextmenu.duplicate")}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            //TODO
            //_export(note);
          }}
        >
          <ArrowRightFromLine
            className="opacity-75"
            size={20}
          ></ArrowRightFromLine>
          &nbsp; {t("sidebar.notes.contextmenu.export")}
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
        <div className="text-foreground/50 text-sm p-1.5">
          {t("sidebar.notes.contextmenu.lastModified")}{" "}
          {note.modifiedAt.toLocaleString()}
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}
