import { useAppSelector } from "@/features/store/hooks";
import { selectNoteById } from "../store/note-selectors";
import { favoritesApi } from "../store/favorites-api";
import { useTranslation } from "react-i18next";
import { ContextMenuItem } from "@/components/ui";
import { Star } from "lucide-react";
import { favorite, unfavorite } from "../store/note-actions";

export function ToggleFavoriteContextMenuItem(props: { noteId: string }) {
  const note = useAppSelector((state) => selectNoteById(state, props.noteId));
  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.notes.contextmenu",
  });
  if (!note) return <></>;

  const _favorite = () => {
    favorite({ noteId: props.noteId });
  };

  const _unfavorite = () => {
    unfavorite(props.noteId);
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
