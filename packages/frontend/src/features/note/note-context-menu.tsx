import { IconMarkdown } from "@tabler/icons-react";
import {
  Copy,
  FileCode,
  FilePlus2,
  FileText,
  Forward,
  GalleryVertical,
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
  const actions = useNoteContextMenu(noteId);
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
        <ContextMenuItem onSelect={actions.openInCenter}>
          <GalleryVertical className="opacity-75" size={20}></GalleryVertical>
          {t("openInCenter")}
        </ContextMenuItem>
        <ContextMenuItem onSelect={actions.newSubpage}>
          <FilePlus2 className="opacity-75" size={20}></FilePlus2>
          {t("newSubpage")}
        </ContextMenuItem>
        <ContextMenuItem onSelect={actions.move}>
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
        <ContextMenuItem onSelect={actions.exportMarkdown}>
          <IconMarkdown size={18} />
          Markdown
        </ContextMenuItem>
        <ContextMenuItem onSelect={actions.exportPDF}>
          <FileText size={18} />
          PDF
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={actions.trash}
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
