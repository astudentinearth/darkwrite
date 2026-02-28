import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui";
import { getNoteIcon } from "@/lib/utils";
import { memo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { navigateToNote } from "../navigation/navigator";
import { useNoteById } from "../note/hooks/use-note-by-id";
import { useSearch } from "../note/hooks/use-search";
import { setSearchOpen, setSearchQuery, useSearchState } from "./search-state";

const SearchItem = memo(function ({ noteId }: { noteId: string }) {
  const { note } = useNoteById(noteId);
  if (!note) return <></>;
  return (
    <CommandItem
      className="px-2 py-4 flex items-center gap-2"
      value={note.id + " " + note.title}
      onSelect={() => {
        setSearchOpen(false);
        navigateToNote(noteId);
      }}
    >
      <span>{getNoteIcon(note.icon)}</span>
      {note.title}
    </CommandItem>
  );
});

export default function SearchDialog() {
  const open = useSearchState((s) => s.open);
  const query = useSearchState((s) => s.query);
  const { t } = useTranslation();
  const { debouncedSearch, isLoading, results } =
    useSearch(query);

  const listRef = useRef<HTMLDivElement>(null!);
  return (
    <CommandDialog
      className="max-w-120"
      open={open}
      onOpenChange={setSearchOpen}
    >
      <CommandInput
        placeholder={t("search.placeholder")}
        value={query}
        onValueChange={(val) => {
          setSearchQuery(val);
          debouncedSearch(val);
          listRef.current.scrollTo(0, 0);
        }}
      />
      <CommandList ref={listRef} className="scroll-view">
        <CommandEmpty>{t("search.noResult")}</CommandEmpty>
        <CommandGroup>
          {results.map((id) => (
            <SearchItem key={id} noteId={id} />
          ))}
          {isLoading && "Loading"}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
