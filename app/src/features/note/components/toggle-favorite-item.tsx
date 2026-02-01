import { useAppSelector } from "@/features/store/hooks";
import { selectNoteById } from "../store/note-selectors";
import { favoritesApi } from "../store/favorites-api";
import { useTranslation } from "react-i18next";
import { ContextMenuItem } from "@/components/ui";
import { Star } from "lucide-react";

export function ToggleFavoriteContextMenuItem(props: { noteId: string }) {
  const note = useAppSelector((state) => selectNoteById(state, props.noteId));
  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.notes.contextmenu",
  });
  if (!note) return <></>;

  const favorite = () => {
    favoritesApi.endpoints.favorite.initiate({ noteId: props.noteId });
  };

  const unfavorite = () => {
    favoritesApi.endpoints.unfavorite.initiate(props.noteId);
  };

  return (
    <>
      {!note.isFavorite && (
        <ContextMenuItem onSelect={favorite}>
          <Star className={"opacity-75"} size={20}></Star>
          {t("addFavorite")}
        </ContextMenuItem>
      )}
      {note.isFavorite && (
        <ContextMenuItem onSelect={unfavorite}>
          <Star className={"text-star fill-star"} size={20}></Star>
          {t("removeFavorite")}
        </ContextMenuItem>
      )}
    </>
  );
}
