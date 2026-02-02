// this file is a stub to provide a clear
// interface for imperative actions.

import { store } from "@/features/store/redux";
import { createNoteApi, CreateNoteArgs } from "./create-note";
import { FavoriteNoteArgs, favoritesApi } from "./favorites-api";

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

export async function duplicateNote(id: string) {
  //TODO
}

export async function moveToTrash(noteId: string) {
  //TODO
}

export async function restoreFromTrash(noteId: string) {
  //TODO
}
