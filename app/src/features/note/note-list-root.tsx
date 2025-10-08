import { Rank } from "@/common/rank";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useNotes } from "@/query/use-notes";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import NoteList from "./note-list";

export default function NoteListRoot() {
  const { notes } = useNotes();
  const {t} = useTranslation("translation", {keyPrefix: "sidebar"});
  const [open, setOpen] = useState(false);
  const rootNotes = useMemo(() => Object.values(notes ?? {}).filter((n) => !n.parentId && !n.isTrashed).toSorted((a, b) => Rank.sorter(a.orderHint, b.orderHint)), [notes]);
  if (rootNotes == null || rootNotes.length === 0) {
    return (
      <div>
        <span>{t("notes.noPages")}</span>
      </div>
    );
  }

  const leadingHint = new Rank(rootNotes[0].orderHint)
    .prev()
    .toString();
  const finalHint = new Rank(rootNotes[rootNotes.length - 1].orderHint)
    .next()
    .toString();

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button className="text-xs p-1 gap-1 h-fit w-full text-foreground/80 hover:text-foreground justify-start" variant={"ghost"}>
          <ChevronRight
              size={16}
              className={cn(
                "transition-transform duration-100",
                open && "rotate-90",
              )}
            />
          {t("title.allNotes")}</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <NoteList
          parentId={null}
          notes={rootNotes}
          leadingOrderHint={leadingHint}
          finalOrderHint={finalHint}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
