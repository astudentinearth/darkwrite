import { NoteDTO } from "@/common/dto";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useNoteContextMenu } from "@/hooks/use-note-context-menu";
import { useNotes } from "@/query/use-notes";
import {
  ArrowRightFromLine,
  Copy,
  Download,
  FileCode,
  FilePlus2,
  FileText,
  Forward,
  Star,
  Trash,
} from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export function NoteContextMenuContainer({
  children,
  note,
  onOpenChange,
  finalOrderHint,
}: {
  children: ReactNode;
  note: NoteDTO;
  onOpenChange?: (val: boolean) => void;
  finalOrderHint?: string;
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.notes.contextmenu",
  });
  const { t: _t } = useTranslation();
  const { nextFavoriteHint } = useNotes();
  const actions = useNoteContextMenu(
    note,
    nextFavoriteHint ?? "",
    finalOrderHint,
  );
  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-64">
        {!note.isFavorite && (
          <ContextMenuItem onSelect={actions.toggleFavorite}>
            <Star className={"opacity-75"} size={20}></Star>
            {t("addFavorite")}
          </ContextMenuItem>
        )}
        {note.isFavorite && (
          <ContextMenuItem onSelect={actions.toggleFavorite}>
            <Star className={"text-star fill-star"} size={20}></Star>
            {t("removeFavorite")}
          </ContextMenuItem>
        )}
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
        <div className="text-foreground/50 text-sm p-1.5">
          {t("lastModified")} {note.modifiedAt.toLocaleString()}
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}
