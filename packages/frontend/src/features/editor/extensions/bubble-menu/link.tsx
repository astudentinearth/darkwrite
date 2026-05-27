import { Link, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { cn, getNoteIcon } from "@/lib/utils";
import { isValidLinkUrl, useLinkOptions } from "../../hooks/use-link-options";

function NoteItem({
  noteId,
  onSelect,
}: {
  noteId: string;
  onSelect: () => void;
}) {
  const { note } = useNoteById(noteId);
  if (!note) return null;
  return (
    <CommandItem
      className="px-2 py-1.5 flex items-center gap-2"
      onSelect={onSelect}
    >
      <span>{getNoteIcon(note.icon)}</span>
      <span>{note.title}</span>
    </CommandItem>
  );
}

export function BubbleLink() {
  const { t } = useTranslation(undefined, { keyPrefix: "editor.bubble" });
  const {
    open,
    setOpen,
    urlRef,
    isLink,
    query,
    setQuery,
    results,
    debouncedSearch,
    setLink,
    setLinkToNote,
    removeLink,
  } = useLinkOptions();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded-lg gap-1 px-2 text-foreground shrink-0 size-9 active:pushdown-98%",
            open && "bg-secondary/80",
            isLink && "text-primary-text",
          )}
        >
          <Link size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-view-2/80 mt-2 backdrop-blur-lg w-80 rounded-xl flex flex-col gap-2 p-2 data-[state=closed]:animate-none! px-1 py-1">
        <Command shouldFilter={false} className="w-full px-0">
          <CommandInput
            value={query}
            onValueChange={(value) => {
              setQuery(value);
              debouncedSearch(value);
            }}
            ref={urlRef}
            className="bg-transparent h-9 w-full"
            placeholder={t("linkPlaceholder")}
          />
          <hr className="mt-1" />
          <CommandList className="scroll-view max-h-48 w-full px-0">
            {isValidLinkUrl(query) && (
              <>
                <CommandItem
                  onSelect={setLink}
                  className="px-2 py-1.5 my-1 flex items-center gap-2"
                >
                  <Link size={18} />
                  <span>{query}</span>
                </CommandItem>
                <hr />
              </>
            )}
            <CommandGroup className="px-0">
              {results.map((noteId) => (
                <NoteItem
                  key={noteId}
                  noteId={noteId}
                  onSelect={() => setLinkToNote(noteId)}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <hr />
        <div className="flex flex-col items-center gap-1 w-full [&>button]:w-full [&>button]:justify-start [&>button]:pl-2">
          <Button
            variant={"ghost"}
            className="h-fit py-1.5"
            onClick={removeLink}
          >
            <Trash size={18} />
            {t("removeLink")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
