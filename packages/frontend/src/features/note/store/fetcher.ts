import { dwErrAsync } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { AppStore } from "@/features/store/types";
import { selectNoteById } from "./note-selectors";

/**
 * Returns a note from the Redux store, or an error if it isn't present.
 * @deprecated read directly from the store instead
 * @param id
 */
export function resolveNote(id: string, store: AppStore) {
  const cached = selectNoteById(store.getState(), id);
  return cached ? okAsync(cached) : dwErrAsync("Note not found.");
}

/**
 * @param noteId
 * @returns the document associated with given note ID;
 */
export function resolveDocument(noteId: string) {
  //TODO: Check Redux first after migrating editor code
  return DarkwriteAPIClient.note.getDocument(noteId).map((r) => r.document);
}
