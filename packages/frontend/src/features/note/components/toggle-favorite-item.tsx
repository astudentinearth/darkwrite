import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContextMenuItem } from "@/components/ui";
import { useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { useNoteActions } from "../store/note-actions";
import { selectIsFavorite, selectNoteById } from "../store/note-selectors";

export function ToggleFavoriteContextMenuItem(props: { noteId: string }) {
  const note = useAppSelector((state) => selectNoteById(state, props.noteId));
  const workspaceId = useCurrentWorkspaceId();
  const isFavorite = useAppSelector((s) =>
    selectIsFavorite(s, workspaceId, props.noteId),
  );
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
      {!isFavorite && (
        <ContextMenuItem onSelect={_favorite}>
          <Star className={"opacity-75"} size={20}></Star>
          {t("addFavorite")}
        </ContextMenuItem>
      )}
      {isFavorite && (
        <ContextMenuItem onSelect={_unfavorite}>
          <Star className={"text-star fill-star"} size={20}></Star>
          {t("removeFavorite")}
        </ContextMenuItem>
      )}
    </>
  );
}
