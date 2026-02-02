import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useNoteContextMenu } from "@/hooks/use-note-context-menu";
import {
  Copy,
  FileCode,
  FilePlus2,
  FileText,
  Forward,
  Trash,
} from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ToggleFavoriteContextMenuItem } from "./components/toggle-favorite-item";
import { ModificationDateLabel } from "./components/modification-date-label";

export function NoteContextMenuContainer({
  children,
  noteId,
  onOpenChange,
}: {
  children: ReactNode;
  noteId: string;
  onOpenChange?: (val: boolean) => void;
  finalOrderHint?: string;
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.notes.contextmenu",
  });
  const { t: _t } = useTranslation();
  const actions = useNoteContextMenu(noteId);
  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-64">
        <ToggleFavoriteContextMenuItem noteId={noteId} />
        <ContextMenuItem onSelect={actions.newSubpage}>
          <FilePlus2 className="opacity-75" size={20}></FilePlus2>
          {t("newSubpage")}
        </ContextMenuItem>
        <ContextMenuItem disabled>
          <Forward className="opacity-75" size={20}></Forward>
          {t("moveTo")}
        </ContextMenuItem>
        <ContextMenuItem onSelect={actions.duplicate}>
          <Copy className="opacity-75" size={20}></Copy>
          {t("duplicate")}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <span className="text-sm mx-2 my-2 flex">{t("export")}</span>
        <ContextMenuItem onSelect={actions.exportHTML}>
          <FileCode size={18} />
          {_t("editor.menu.htmlExport")}
        </ContextMenuItem>
        <ContextMenuItem onSelect={actions.exportJSON}>
          <FileText size={18} />
          {_t("editor.menu.jsonExport")}
        </ContextMenuItem>
        <ContextMenuItem onSelect={actions.exportPdf}>
          <FileText size={18} />
          PDF
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={actions.trash}
          className="group focus:text-destructive"
        >
          <Trash
            className="opacity-75 group-focus:text-destructive"
            size={20}
          ></Trash>
          {t("trash")}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ModificationDateLabel noteId={noteId} />
      </ContextMenuContent>
    </ContextMenu>
  );
}
