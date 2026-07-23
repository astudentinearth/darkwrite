import { IconStar } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { selectIsFavorite } from "@/features/note/store/note-selectors";
import { useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { cn } from "@/lib/utils";
import { useNoteById } from "../note/hooks/use-note-by-id";
import { useNoteActions } from "../note/store/note-actions";

export default function FavoriteToggle({ id }: { id: string }) {
  const { note } = useNoteById(id);
  const workspaceId = useCurrentWorkspaceId();
  const isFavorite = useAppSelector((s) =>
    selectIsFavorite(s, workspaceId, id),
  );
  const { t } = useTranslation();
  const { favorite, unfavorite } = useNoteActions();
  if (!note) return null;
  const click = () => {
    if (isFavorite) unfavorite(note.id);
    else favorite({ noteId: note.id });
  };
  return (
    <TextTooltip
      text={
        isFavorite
          ? t("sidebar.notes.contextmenu.removeFavorite")
          : t("sidebar.notes.contextmenu.addFavorite")
      }
    >
      <HeaderbarButton onClick={click}>
        <IconStar
          size={20}
          className={cn(isFavorite && "text-star fill-star")}
        />
      </HeaderbarButton>
    </TextTooltip>
  );
}
