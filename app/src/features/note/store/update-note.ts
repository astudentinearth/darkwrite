import { DarkwriteAPIClient } from "@/api/api-client";
import _ from "lodash";
import { notesSlice } from "./note-slice";
import { store } from "@/features/store/redux";

const DEBOUNCE_TIME = 150;

export function createTitleUpdater(noteId: string) {
  async function _titleUpdater(title: string) {
    return await DarkwriteAPIClient.note.update(noteId, { title });
  }

  const _persistTitleDelayed = _.debounce(_titleUpdater, DEBOUNCE_TIME);

  function update(title: string) {
    store.dispatch(
      notesSlice.actions.updateNote({ id: noteId, changes: { title } }),
    );
    _persistTitleDelayed(title);
  }

  /**
   * Flushes any pending title updates and replaces the note in the store with the updated version from the server.
   */
  async function flush() {
    let result = await _persistTitleDelayed.flush();
    if (!result) {
      result = await DarkwriteAPIClient.note.getById(noteId);
    }
    const { note } = result;
    if (note) {
      store.dispatch(notesSlice.actions.upsertNotes([note]));
    }
  }

  return {
    update,
    flush,
  };
}

export function updateIcon(noteId: string, icon: string | null) {
  store.dispatch(
    notesSlice.actions.updateNote({ id: noteId, changes: { icon } }),
  );
  DarkwriteAPIClient.note.update(noteId, { icon });
}
