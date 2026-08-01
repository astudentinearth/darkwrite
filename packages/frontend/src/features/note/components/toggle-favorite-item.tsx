import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContextMenuItem } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { reorderFavorite, unfavorite } from "../store/note.thunk";
import { selectNoteById } from "../store/note-selectors";

export function ToggleFavoriteContextMenuItem(props: { noteId: string }) {
  const note = useAppSelector((state) => selectNoteById(state, props.noteId));
  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.notes.contextmenu",
  });
  const dispatch = useAppDispatch();
  if (!note) return <></>;

  const _favorite = () => {
    dispatch(reorderFavorite(note.id));
  };

  const _unfavorite = () => {
    dispatch(unfavorite(props.noteId));
  };

  return (
    <>
      {!note.isFavorite && (
        <ContextMenuItem onSelect={_favorite}>
          <Star className={"opacity-75"} size={20}></Star>
          {t("addFavorite")}
        </ContextMenuItem>
      )}
      {note.isFavorite && (
        <ContextMenuItem onSelect={_unfavorite}>
          <Star className={"text-star fill-star"} size={20}></Star>
          {t("removeFavorite")}
        </ContextMenuItem>
      )}
    </>
  );
}
