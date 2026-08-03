import _ from "lodash";
import { useMemo } from "react";
import { DarkwriteAPIClient } from "@/api/api-client";
import { useAppDispatch } from "@/features/store/hooks";
import type { AppDispatch } from "@/features/store/types";
import { updateNote } from "./note.thunk";
import { notesSlice } from "./note-slice";

const DEBOUNCE_TIME = 150;

export function createTitleUpdater(noteId: string, dispatch: AppDispatch) {
  async function _titleUpdater(title: string) {
    return await DarkwriteAPIClient.note.patchAll([
      { id: noteId, title, modifiedAt: new Date().toISOString() },
    ]);
  }

  const _persistTitleDelayed = _.debounce(_titleUpdater, DEBOUNCE_TIME);

  function update(title: string) {
    dispatch(notesSlice.actions.updateNote({ id: noteId, changes: { title } }));
    _persistTitleDelayed(title);
  }

  /**
   * Flushes any pending title updates.   */
  async function flush() {
    await _persistTitleDelayed.flush();
  }

  const updateIcon = (noteId: string, icon: string | null) =>
    dispatch(updateNote({ id: noteId, icon }));

  return {
    update,
    flush,
    updateIcon,
  };
}

export function useTitleUpdater(noteId: string) {
  const dispatch = useAppDispatch();
  const updater = useMemo(
    () => createTitleUpdater(noteId, dispatch),
    [noteId, dispatch],
  );
  return updater;
}
