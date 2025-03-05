import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
} from "@darkwrite/ui";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { useNotesQuery, useUpdateNoteMutation } from "@renderer/hooks/query";
import { useDeleteNoteMutation } from "@renderer/hooks/query/use-delete-note-mutation";
import { useNavigateToNote } from "@renderer/hooks/use-navigate-to-note";
import { cn, getNoteIcon } from "@renderer/lib/utils";
import { Trash, Undo } from "lucide-react";
import { DragEvent, useState } from "react";
import { useTranslation } from "react-i18next";

export function TrashWidget() {
  const notes = useNotesQuery().data;
  const update = useUpdateNoteMutation().mutate;

  const restore = (id: string) => update({ id, isTrashed: false });
  const trash = (id: string) => update({ id, isTrashed: true });

  const del = useDeleteNoteMutation().mutate;
  const [query, setQuery] = useState<string>("");
  let trashed = notes?.filter((n) => n.isTrashed);
  if (query && trashed) {
    trashed = trashed.filter((n) => n.title.includes(query));
  }
  const nav = useNavigateToNote();
  const { t } = useTranslation();

  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    console.log("Dropping into trash");
    event.stopPropagation();
    event.preventDefault();
    const _id = event.dataTransfer.getData("note_id");
    console.log(_id);
    trash(_id);
    setDragOver(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "rounded-[8px] gap-0 hover:bg-secondary/50 text-foreground/60 hover:text-foreground active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr] select-none p-1 pl-2 h-8 overflow-hidden",
            dragOver && "bg-primary/20",
          )}
          //onDragEnter={() => setDragOver(true)}
          onDragLeave={() => setDragOver(false)}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDrop={handleDrop}
          onDragEnd={() => setDragOver(false)}
        >
          <Trash size={16} />
          <span className="justify-self-start">
            {t("sidebar.button.trash")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={"right"}
        className={cn("rounded-xl h-[70vh] flex flex-col mb-4 p-0")}
        sticky="always"
      >
        <div className="w-full p-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg bg-view-2 text-sm p-2 h-fit"
            placeholder="Search in trash"
          />
        </div>
        <ScrollArea className="overflow-y-auto p-2 grow">
          <div className="">
            {trashed?.map((note) => (
              <div key={note.id}>
                <div
                  onClick={() => {
                    nav(note.id);
                  }}
                  className={cn(
                    "rounded-[8px] note-item duration-100 hover:bg-secondary/50 hover:text-foreground font-medium active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr_32px_32px] select-none p-1 overflow-hidden",
                  )}
                >
                  <div className="flex w-6 items-center justify-center text-[18px] translate-y-[-5%]">
                    {getNoteIcon(note.icon)}
                  </div>
                  <span
                    className={cn(
                      "text-ellipsis whitespace-nowrap block overflow-hidden text-sm self-center pl-1",
                    )}
                  >
                    {note.title}
                  </span>
                  <Button
                    title={t("sidebar.trash.restore")}
                    className="justify-self-end btn-add text-foreground/75 hover:text-foreground/100 size-8 p-0"
                    variant={"ghost"}
                    onClick={(e) => {
                      e.stopPropagation();
                      restore(note.id);
                    }}
                  >
                    <Undo size={18} />
                  </Button>
                  <Button
                    title={t("sidebar.trash.delete")}
                    className="justify-self-end btn-add text-destructive/75 hover:text-destructive/100 size-8 p-0"
                    variant={"ghost"}
                    onClick={(e) => {
                      e.stopPropagation();
                      del(note.id);
                    }}
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
