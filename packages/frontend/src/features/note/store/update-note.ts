import _ from "lodash";
import { useMemo } from "react";
import { DarkwriteAPIClient } from "@/api/api-client";
import { useAppStore } from "@/features/store/hooks";
import type { AppStore } from "@/features/store/types";
import { notesSlice } from "./note-slice";

const DEBOUNCE_TIME = 150;

export function createTitleUpdater(noteId: string, store: AppStore) {
  async function _titleUpdater(title: string) {
    return await DarkwriteAPIClient.note.update(noteId, { title });
  }

  const _persistTitleDelayed = _.debounce(_titleUpdater, DEBOUNCE_TIME);

  function update(title: string) {
    store.dispatch(
      notesSlice.actions.updateNote({
        id: noteId,
        changes: { title, modifiedAt: new Date().toISOString() },
      }),
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
    if (result.isErr()) return;
    const { note } = result.value;
    if (note) {
      store.dispatch(notesSlice.actions.upsertNotes([note]));
    }
  }

  function updateIcon(noteId: string, icon: string | null) {
    store.dispatch(
      notesSlice.actions.updateNote({
        id: noteId,
        changes: { icon, modifiedAt: new Date().toISOString() },
      }),
    );
    DarkwriteAPIClient.note.update(noteId, { icon });
  }
  return {
    update,
    flush,
    updateIcon,
  };
}

export function useTitleUpdater(noteId: string) {
  const store = useAppStore();
  const updater = useMemo(
    () => createTitleUpdater(noteId, store),
    [noteId, store],
  );
  return updater;
}
