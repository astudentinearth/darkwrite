import { NoteDTO } from "@/common/dto";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ArrowRightFromLine, Copy, FilePlus2, Forward, Star, Trash } from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export function NoteContextMenuContainer({
  children,
  note,
  onOpenChange
}: {
  children: ReactNode;
  note: NoteDTO;
  onOpenChange?: (val: boolean) => void;
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.notes.contextmenu",
  });
  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-64">
        {!note.isFavorite && (
          <ContextMenuItem>
            <Star className={"text-star fill-star"} size={20}></Star>
            {t("addFavorite")}
          </ContextMenuItem>
        )}
        {note.isFavorite && (
          <ContextMenuItem>
            <Star className={"opacity-75"} size={20}></Star>
            {t("removeFavorite")}</ContextMenuItem>
        )}
        <ContextMenuItem><FilePlus2 className="opacity-75" size={20}></FilePlus2>{t("newSubpage")}</ContextMenuItem>
        <ContextMenuItem><Forward className="opacity-75" size={20}></Forward>{t("moveTo")}</ContextMenuItem>
        <ContextMenuItem><Copy className="opacity-75" size={20}></Copy>{t("duplicate")}</ContextMenuItem>
        <ContextMenuItem><ArrowRightFromLine
            className="opacity-75"
            size={20}
          ></ArrowRightFromLine>{t("export")}</ContextMenuItem>
        <ContextMenuItem><Trash
            className="opacity-75 group-focus:text-destructive"
            size={20}
          ></Trash>{t("trash")}</ContextMenuItem>
          <ContextMenuSeparator/>
          <div className="text-foreground/50 text-sm p-1.5">
          {t("lastModified")}{" "}
          {note.modifiedAt.toLocaleString()}
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}
