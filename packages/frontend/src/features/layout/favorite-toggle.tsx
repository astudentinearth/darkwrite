import { IconStar } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNoteById } from "../note/hooks/use-note-by-id";
import { reorderFavorite, unfavorite } from "../note/store/note.thunk";
import { useAppDispatch } from "../store/hooks";

export default function FavoriteToggle({ id }: { id: string }) {
  const { note } = useNoteById(id);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  if (!note) return null;
  const click = () => {
    if (note.isFavorite) dispatch(unfavorite(note.id));
    else dispatch(reorderFavorite(note.id));
  };
  return (
    <TextTooltip
      text={
        note.isFavorite
          ? t("sidebar.notes.contextmenu.removeFavorite")
          : t("sidebar.notes.contextmenu.addFavorite")
      }
    >
      <HeaderbarButton onClick={click}>
        <IconStar
          size={20}
          className={cn(note.isFavorite && "text-star fill-star")}
        />
      </HeaderbarButton>
    </TextTooltip>
  );
}
