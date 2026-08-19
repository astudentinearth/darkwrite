import { memo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  ScrollArea,
} from "@/components/ui";
import { getNoteIcon } from "@/lib/utils";
import { navigateToNote } from "../navigation/navigator";
import { NoteTitle } from "../note/components/note-title";
import { useNoteById } from "../note/hooks/use-note-by-id";
import { useSearch } from "../note/hooks/use-search";
import { setSearchOpen, setSearchQuery, useSearchState } from "./search-state";

const SearchItem = memo(function ({ noteId }: { noteId: string }) {
  const { note } = useNoteById(noteId);
  if (!note) return <></>;
  return (
    <CommandItem
      className="px-2 py-1.5 flex items-center gap-2"
      value={`${note.id} ${note.title}`}
      onSelect={() => {
        setSearchOpen(false);
        navigateToNote(noteId);
      }}
    >
      <span>{getNoteIcon(note.icon)}</span>
      <NoteTitle>{note.title}</NoteTitle>
    </CommandItem>
  );
});

function Results() {
  const query = useSearchState((s) => s.query);
  const { results } = useSearch(query);
  return results.map((id) => <SearchItem key={id} noteId={id} />);
}

export default function SearchDialog() {
  const open = useSearchState((s) => s.open);
  const query = useSearchState((s) => s.query);
  const { t } = useTranslation();

  // biome-ignore lint/style/noNonNullAssertion: ref is always set
  const listRef = useRef<HTMLDivElement>(null!);
  return (
    <Dialog open={open} onOpenChange={setSearchOpen}>
      <DialogContent
        noOverlay
        className="max-w-120 bg-view-1/80 backdrop-blur-lg p-0 origin-top top-16 translate-y-0 drop-shadow-2xl"
      >
        <Command>
          <CommandInput
            placeholder={t("search.placeholder")}
            value={query}
            onValueChange={(val) => {
              setSearchQuery(val);
              listRef.current.scrollTo(0, 0);
            }}
          />
          <CommandList ref={listRef} className="w-full hide-scrollbar">
            <CommandEmpty>{t("search.noResult")}</CommandEmpty>
            <CommandGroup>
              {query.trim() === "" && (
                <span className="pl-2.5">{t("home.recents")}</span>
              )}
              <Results />
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
