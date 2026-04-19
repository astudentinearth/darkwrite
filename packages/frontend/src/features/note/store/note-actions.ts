// this file is a stub to provide a clear
// interface for imperative actions.

import { createNoteApi, CreateNoteArgs } from "./create-note";
import { FavoriteNoteArgs, favoritesApi } from "./favorites-api";
import { navigateToNote } from "@/features/navigation/navigator";
import { trashApi } from "./trash-api";
import { moveNoteApi } from "./move-note";
import { t } from "i18next";
import type { AppDispatch } from "@/features/store/types";
import { useAppDispatch } from "@/features/store/hooks";
import { useMemo } from "react";
import notify from "@/features/notifications/notify";

export const getNoteActions = (dispatch: AppDispatch) => ({
  async createNote(args: CreateNoteArgs) {
    dispatch(createNoteApi.endpoints.createNote.initiate(args));
  },

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

  async moveInto(noteId: string, destinationNoteId: string, showToast = true) {
    const result = dispatch(
      moveNoteApi.endpoints.moveInto.initiate({
        destinationNoteId,
        placement: "inside-end",
        sourceNoteId: noteId,
      }),
    ).unwrap();
    try {
      await result;
      if (showToast) notify.success(t("toast.movePage.success"));
    } catch (error) {
      if (showToast) {
        notify.error(t("toast.movePage.error"));
      }
      console.error("Failed to move note:", error);
    }
    return result;
  },
});

export function useNoteActions() {
  const dispatch = useAppDispatch();
  const actions = useMemo(() => getNoteActions(dispatch), [dispatch]);
  return actions;
}
