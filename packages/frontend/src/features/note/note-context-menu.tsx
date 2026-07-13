import { NoteType } from "@darkwrite/common";
import {
  Copy,
  FileCode,
  FilePlus2,
  FileText,
  Forward,
  GalleryVertical,
  Grid2x2Plus,
  Trash,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { ModificationDateLabel } from "./components/modification-date-label";
import { ToggleFavoriteContextMenuItem } from "./components/toggle-favorite-item";
import { useNoteContextMenu } from "./hooks/use-note-context-menu";

export function NoteContextMenuContainer({
  children,
  noteId,
  onOpenChange,
}: {
  children: ReactNode;
  noteId: string;
  onOpenChange?: (val: boolean) => void;
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.notes.contextmenu",
  });
  const { t: _t } = useTranslation();
  const context = useNoteContextMenu(noteId);
  const [open, setOpen] = useState(false);

  const openChanged = (val: boolean) => {
    setOpen(val);
    onOpenChange?.(val);
  };

  return (
    <ContextMenu onOpenChange={openChanged}>
      <ContextMenuTrigger className={cn(open && "bg-primary/10")} asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-64">
        <ToggleFavoriteContextMenuItem noteId={noteId} />{" "}
        <ContextMenuItem onSelect={context.openInCenter}>
          <GalleryVertical className="opacity-75" size={20}></GalleryVertical>
          {t("openInCenter")}
        </ContextMenuItem>
        {context.type !== NoteType.DatabaseView && (
          <>
            {" "}
            <ContextMenuItem onSelect={context.newSubpage}>
              <FilePlus2 className="opacity-75" size={20}></FilePlus2>
              {t("newSubpage")}
            </ContextMenuItem>
            <ContextMenuItem onSelect={context.newDatabase}>
              <Grid2x2Plus className="opacity-75" size={20} />
              <span>New database</span>
            </ContextMenuItem>
            <ContextMenuItem onSelect={context.move}>
              <Forward className="opacity-75" size={20}></Forward>
              {t("moveTo")}
            </ContextMenuItem>
            <ContextMenuItem onSelect={context.duplicate}>
              <Copy className="opacity-75" size={20}></Copy>
              {t("duplicate")}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <span className="text-sm mx-2 my-2 flex">{t("export")}</span>
            <ContextMenuItem onSelect={context.exportHTML}>
              <FileCode size={18} />
              {_t("editor.menu.htmlExport")}
            </ContextMenuItem>
            <ContextMenuItem onSelect={context.exportJSON}>
              <FileText size={18} />
              {_t("editor.menu.jsonExport")}
            </ContextMenuItem>
            <ContextMenuItem onSelect={context.exportPDF}>
              <FileText size={18} />
              PDF
            </ContextMenuItem>
          </>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={context.trash}
          variant="destructive"
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
