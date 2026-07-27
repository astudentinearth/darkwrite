import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useSessionActions } from "../session/session-actions";
import { useAllNotesViewOpen } from "../session/session-hooks";
import { SidebarItem } from "../sidebar/sidebar-item";
import NoteList from "./components/note-list";

export default function NoteListRoot() {
  const { t } = useTranslation("translation", { keyPrefix: "sidebar" });
  const open = useAllNotesViewOpen();
  const setOpen = useSessionActions().setAllNotesViewOpen;
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <SidebarItem className="w-full gap-1">
          {t("title.allNotes")}
          <ChevronRight
            size={16}
            className={cn(
              "transition-transform duration-100",
              open && "rotate-90",
            )}
          />
        </SidebarItem>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <NoteList parentId={null} />
      </CollapsibleContent>
    </Collapsible>
  );
}
