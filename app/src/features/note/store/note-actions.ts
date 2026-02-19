// this file is a stub to provide a clear
// interface for imperative actions.

import { store } from "@/features/store/redux";
import { createNoteApi, CreateNoteArgs } from "./create-note";
import { FavoriteNoteArgs, favoritesApi } from "./favorites-api";
import { navigateToNote } from "@/features/navigation/navigator";
import { trashApi } from "./trash-api";

const dispatch = store.dispatch;

export async function createNote(args: CreateNoteArgs) {
  dispatch(createNoteApi.endpoints.createNote.initiate(args));
}

export async function favorite(args: FavoriteNoteArgs) {
  dispatch(favoritesApi.endpoints.favorite.initiate(args));
}

export async function unfavorite(noteId: string) {
  dispatch(favoritesApi.endpoints.unfavorite.initiate(noteId));
}

export async function duplicateNote(id: string, navigateAfter = true) {
  dispatch(createNoteApi.endpoints.duplicateNote.initiate(id))
    .unwrap()
    .then((note) => {
      if (navigateAfter) navigateToNote(note.id);
    });
}

export async function moveToTrash(noteId: string) {
  dispatch(trashApi.endpoints.moveToTrash.initiate(noteId));
}

export async function restoreFromTrash(noteId: string) {
  dispatch(trashApi.endpoints.restoreFromTrash.initiate(noteId));
}

export function permanentlyDeleteNote(noteId: string) {
  dispatch(trashApi.endpoints.delete.initiate(noteId));
}
