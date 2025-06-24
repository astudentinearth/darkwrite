import { HeaderbarButton } from "@renderer/components/ui/headerbar-button";
import { useNotesQuery, useUpdateNoteMutation } from "@renderer/hooks/query";
import { useNoteFromURL } from "@renderer/hooks/use-note-from-url";
import { cn } from "@renderer/lib/utils";
import { Star } from "lucide-react";

export function FavoriteActionButton() {
  const id = useNoteFromURL();
  const notes = useNotesQuery().data;
  const targetNote = notes?.find((n) => n.id === id);
  const update = useUpdateNoteMutation().mutate;

  if (!id) return <></>;
  return (
    <HeaderbarButton
      onClick={() => update({ id, dto: {isFavorite: !targetNote?.isFavorite} })}
    >
      <Star
        size={18}
        className={cn(targetNote?.isFavorite && "text-star fill-star")}
      />
    </HeaderbarButton>
  );
}
