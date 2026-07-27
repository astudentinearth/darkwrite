import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNoteById } from "../note/hooks/use-note-by-id";
import { useNoteActions } from "../note/store/note-actions";

export default function FavoriteToggle({ id }: { id: string }) {
  const { note } = useNoteById(id);
  const { t } = useTranslation();
  const { favorite, unfavorite } = useNoteActions();
  if (!note) return null;
  const click = () => {
    if (note.isFavorite) unfavorite(note.id);
    else favorite({ noteId: note.id });
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
        <Star
          size={20}
          className={cn(note.isFavorite && "text-star fill-star")}
        />
      </HeaderbarButton>
    </TextTooltip>
  );
}
