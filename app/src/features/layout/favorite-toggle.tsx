import { HeaderbarButton } from "@/components/headerbar-button";
import { cn } from "@/lib/utils";
import { useNoteFromURL } from "@/features/note/hooks/use-note-from-url";
import { Star } from "lucide-react";
import { useNoteById } from "../note/hooks/use-note-by-id";
import { useNoteActions } from "../note/store/note-actions";

export default function FavoriteToggle() {
  const id = useNoteFromURL();
  const { note } = useNoteById(id);
  const { favorite, unfavorite } = useNoteActions();
  if (!note) return null;
  const click = () => {
    if (note.isFavorite) unfavorite(note.id);
    else favorite({ noteId: note.id });
  };
  return (
    <HeaderbarButton onClick={click}>
      <Star
        size={20}
        className={cn(note.isFavorite && "text-star fill-star")}
      />
    </HeaderbarButton>
  );
}
