import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@darkwrite/ui";
import { useNotesQuery } from "@/hooks/query";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";
import { getNoteIcon } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function SearchDialog(props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const notes = useNotesQuery().data?.filter((n) => !n.isTrashed);
  const { open, setOpen } = props;
  const [search, setSearch] = useState("");
  const nav = useNavigateToNote();
  const {t} = useTranslation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="rounded-xl! bg-background/70 backdrop-blur-lg max-w-[720px]"
    >
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder={t("search.placeholder")}
      />
      <CommandList className="scrollbar p-1 pb-1">
        <CommandEmpty>{t("search.noResult")}</CommandEmpty>
        {notes
          ?.filter((n) =>
            n.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
          )
          .map((n) => (
            <CommandItem
              onSelect={() => {
                nav(n.id);
                setOpen(false);
              }}
              key={n.id}
              value={`${n.id}$${n.title}`}
              className="flex gap-2 transition-colors rounded-lg"
            >
              {getNoteIcon(n.icon)}
              {n.title}
            </CommandItem>
          ))}
      </CommandList>
    </CommandDialog>
  );
}
