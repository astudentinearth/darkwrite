import { dwErrAsync } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { AppStore } from "@/features/store/types";
import { selectNoteById } from "./note-selectors";
import { upsertNotes } from "./note-slice";

/**
 * Returns a note from cache, or fetches it from the backend.
 * The note will be placed into the cache if it's fetched later.
 * @param id
 */
export function resolveNote(id: string, store: AppStore) {
  const cached = selectNoteById(store.getState(), id);
  if (cached != null) return okAsync(cached);

  return DarkwriteAPIClient.note
    .getById(id)
    .andThen((n) => (n.note ? okAsync(n.note) : dwErrAsync("Note not found.")))
    .map((note) => {
      store.dispatch(upsertNotes([note]));
      return note;
    });
}

/**
 * @param noteId
 * @returns the document associated with given note ID;
 */
export function resolveDocument(noteId: string) {
  //TODO: Check Redux first after migrating editor code
  return DarkwriteAPIClient.note.getDocument(noteId).map((r) => r.document);
}
