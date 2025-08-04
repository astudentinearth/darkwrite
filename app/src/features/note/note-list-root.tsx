import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNotes } from "@/query/use-notes";
import { LexoRank } from "lexorank";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import NoteList from "./note-list";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function NoteListRoot() {
  const { notes } = useNotes();
  const {t} = useTranslation("translation", {keyPrefix: "sidebar"});
  const rootNotes = useMemo(() => notes?.filter((n) => !n.parentId), [notes]);
  const [open, setOpen] = useState(false);
  if (rootNotes == null || rootNotes.length === 0) {
    return (
      <div>
        <span>{t("notes.noPages")}</span>
      </div>
    );
  }

  const leadingHint = LexoRank.parse(rootNotes[0].orderHint)
    .genPrev()
    .toString();
  const finalHint = LexoRank.parse(rootNotes[rootNotes.length - 1].orderHint)
    .genNext()
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
