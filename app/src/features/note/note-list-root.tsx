import { Rank } from "@/common/rank";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NoteList from "./note-list";
import { useNoteChildren } from "./use-note-children";

export default function NoteListRoot() {
  const { t } = useTranslation("translation", { keyPrefix: "sidebar" });
  const [open, setOpen] = useState(false);
  const { data } = useNoteChildren(null);
  const rootNotes = data;

  if (rootNotes == null || rootNotes.length === 0) {
    return (
      <div>
        <span>{t("notes.noPages")}</span>
      </div>
    );
  }

  const leadingHint = new Rank(rootNotes[0].orderHint).prev().toString();
  const finalHint = new Rank(rootNotes[rootNotes.length - 1].orderHint)
    .next()
    .toString();

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          className="text-xs p-1 gap-1 h-fit w-full text-foreground/80 hover:text-foreground justify-start"
          variant={"ghost"}
        >
          <ChevronRight
            size={16}
            className={cn(
              "transition-transform duration-100",
              open && "rotate-90",
            )}
          />
          {t("title.allNotes")}
        </Button>
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
