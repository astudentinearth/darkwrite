import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui";
import { setSearchOpen, setSearchQuery, useSearchState } from "./search-state";
import { useTranslation } from "react-i18next";
import { useNotes } from "@/query/use-notes";
import { useCallback, useEffect, useMemo, useRef } from "react";
import NoteHeader from "../note/note-header";
import { getNoteIcon } from "@/lib/utils";

export default function SearchDialog() {
  const open = useSearchState((s) => s.open);
  const query = useSearchState((s) => s.query);
  const { t } = useTranslation();
  const { notes } = useNotes();
  useEffect(() => {
    console.log("notes changed inside search");
  }, [notes]);
  const items = useCallback(() => {
    console.log("memo");
    const noteList = Object.values(notes ?? {});
    return noteList
      .filter((n) => !n.isTrashed)
      .map((n) => (
        <CommandItem
          className="px-2 py-4 flex items-center gap-2"
          value={n.id + " " + n.title}
        >
          <span>{getNoteIcon(n.icon)}</span>
          {n.title}
        </CommandItem>
      ));
  }, [notes]);

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
          listRef.current.scrollTo(0, 0);
        }}
      />
      <CommandList ref={listRef} className="scroll-view">
        <CommandEmpty>{t("search.noResult")}</CommandEmpty>
        <CommandGroup>{items()}</CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
