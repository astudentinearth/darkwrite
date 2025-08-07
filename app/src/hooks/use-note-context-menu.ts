import { NoteDTO } from "@/common/dto";
import { useCreateNoteMutation } from "@/query/use-create-note";
import { useUpdateNote } from "@/query/use-update-note";

export const useNoteContextMenu = (note: NoteDTO, nextFavoriteHint: string, orderHint?: string) => {
  const { update } = useUpdateNote();
  const { create } = useCreateNoteMutation();
  const toggleFavorite = () =>
    update({ id: note.id, dto: { isFavorite: !note.isFavorite, favoriteOrderHint: note.isFavorite ? "" : nextFavoriteHint } });
  const newSubpage = () =>
    create({ title: "Untitled", parentId: note.id, orderHint });
  const trash = () => update({ id: note.id, dto: { isTrashed: true } });
  return { toggleFavorite, newSubpage, trash };
};
