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
import { useNoteItemDrag } from "./hooks/use-note-item";

/** @deprecated */
export default function NoteListRoot() {
  const { t } = useTranslation("translation", { keyPrefix: "sidebar" });
  const open = useAllNotesViewOpen();
  const setOpen = useSessionActions().setAllNotesViewOpen;

  const { onDragEnter, onDragOver, onDragLeave, onDrop, isDragging } =
    useNoteItemDrag(null);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <SidebarItem
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "w-full gap-1 text-xs pl-2",
            isDragging && "bg-primary/20",
          )}
        >
          <ChevronRight
            size={16}
            className={cn(
              "transition-transform duration-100",
              open && "rotate-90",
            )}
          />
          {t("title.allNotes")}
        </SidebarItem>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <NoteList parentId={null} />
      </CollapsibleContent>
    </Collapsible>
  );
}
