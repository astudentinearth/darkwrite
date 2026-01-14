import { HeaderbarButton } from "@/components/headerbar-button";
import { cn } from "@/lib/utils";
import { useNoteFromURL } from "@/query/use-note-from-url";
import { useNotes } from "@/query/use-notes";
import { useUpdateNote } from "@/query/use-update-note";
import { Star } from "lucide-react";

export default function FavoriteToggle() {
  const id = useNoteFromURL();
  const { notes, nextFavoriteHint } = useNotes();
  const { update } = useUpdateNote();
  if (!notes || !id) return;
  const note = notes[id];
  if (!note) return;
  const click = () => {
    update({ id, dto: { isFavorite: !note.isFavorite } });
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
