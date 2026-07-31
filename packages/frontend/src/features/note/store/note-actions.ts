// this file is a stub to provide a clear
// interface for imperative actions.

import { t } from "i18next";
import { useMemo } from "react";
import { navigateToNote } from "@/features/navigation/navigator";
import notify from "@/features/notifications/notify";
import { useAppDispatch } from "@/features/store/hooks";
import type { AppDispatch } from "@/features/store/types";
import { createNoteApi } from "./create-note";
import { type FavoriteNoteArgs, favoritesApi } from "./favorites-api";
import { trashApi } from "./trash-api";

export const getNoteActions = (dispatch: AppDispatch) => ({
  async favorite(args: FavoriteNoteArgs) {
    dispatch(favoritesApi.endpoints.favorite.initiate(args));
  },

  async unfavorite(noteId: string) {
    dispatch(favoritesApi.endpoints.unfavorite.initiate(noteId));
  },

  async duplicateNote(id: string, navigateAfter = true) {
    dispatch(createNoteApi.endpoints.duplicateNote.initiate(id))
      .unwrap()
      .then((note) => {
        if (navigateAfter) navigateToNote(note.id);
      });
  },

  async moveToTrash(noteId: string) {
    dispatch(trashApi.endpoints.moveToTrash.initiate(noteId)).then(() => {
      notify.success(t("toast.trashPage.success"));
    });
  },

  async restoreFromTrash(noteId: string) {
    dispatch(trashApi.endpoints.restoreFromTrash.initiate(noteId)).then(() => {
      notify.success(t("toast.restorePage.success"));
    });
  },

  permanentlyDeleteNote(noteId: string) {
    dispatch(trashApi.endpoints.delete.initiate(noteId)).then(() => {
      notify.success(t("toast.deletePage.success"));
    });
  },
});

export function useNoteActions() {
  const dispatch = useAppDispatch();
  const actions = useMemo(() => getNoteActions(dispatch), [dispatch]);
  return actions;
}
