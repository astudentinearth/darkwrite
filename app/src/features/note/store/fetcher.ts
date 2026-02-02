import { store } from "@/features/store/redux";
import { selectNoteById } from "./note-selectors";
import { DarkwriteAPIClient } from "@/api/api-client";
import { upsertNotes } from "./note-slice";

/**
 * Returns a note from cache, or fetches it from the backend.
 * The note will be placed into the cache if it's fetched later.
 * @param id
 */
export async function resolveNote(id: string) {
  const cached = selectNoteById(store.getState(), id);
  if (cached != null) return cached;

  const { note } = await DarkwriteAPIClient.note.getById(id);
  if (!note) throw new Error("Note not found.");
  store.dispatch(upsertNotes([note]));
  return note;
}

/**
 * @param noteId
 * @returns the document associated with given note ID;
 */
export async function resolveDocument(noteId: string) {
  //TODO: Check Redux first after migrating editor code
  const result = await DarkwriteAPIClient.note.getDocument(noteId);
  return result.document;
}
