import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoteList from "./components/note-list";
import { useAllNotesViewOpen } from "../session/session-hooks";
import { setAllNotesViewOpen } from "../session/session-actions";

export default function NoteListRoot() {
  const { t } = useTranslation("translation", { keyPrefix: "sidebar" });
  const open = useAllNotesViewOpen();
  const setOpen = setAllNotesViewOpen;

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
        <NoteList parentId={null} />
      </CollapsibleContent>
    </Collapsible>
  );
}
