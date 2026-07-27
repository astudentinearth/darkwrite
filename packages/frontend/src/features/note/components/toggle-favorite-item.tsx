import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContextMenuItem } from "@/components/ui";
import { useAppSelector } from "@/features/store/hooks";
import { useNoteActions } from "../store/note-actions";
import { selectNoteById } from "../store/note-selectors";

export function ToggleFavoriteContextMenuItem(props: { noteId: string }) {
  const note = useAppSelector((state) => selectNoteById(state, props.noteId));
  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.notes.contextmenu",
  });
  const { favorite, unfavorite } = useNoteActions();
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
