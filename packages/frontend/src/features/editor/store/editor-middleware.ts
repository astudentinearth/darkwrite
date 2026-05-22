import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { debounce, type DebouncedFunc } from "lodash";
import { editorSlice } from "./editor-slice";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { RootState } from "@/features/store/types";

const AUTOSAVE_DEBOUNCE_MS = 300;

const editorMiddleware = createListenerMiddleware();

const debouncedSaves = new Map<string, DebouncedFunc<() => Promise<void>>>();

export const flushPendingEditorSaves = () => debouncedSaves.values().forEach((save) => save.flush());

editorMiddleware.startListening({
  matcher: isAnyOf(
    editorSlice.actions.updateDocumentContent,
    editorSlice.actions.updateDocumentCustomizations,
  ),
  effect: (action, listenerApi) => {
    const { noteId } = action.payload as { noteId: string };

    let debouncedSave = debouncedSaves.get(noteId);

    if (!debouncedSave) {
      debouncedSave = debounce(async () => {
        const state = listenerApi.getState() as RootState;
        const document = state.editor.docs[noteId];

        if (document) {
          await DarkwriteAPIClient.note.setDocument(
            noteId,
            JSON.stringify(document),
          );
        }
      }, AUTOSAVE_DEBOUNCE_MS);

      debouncedSaves.set(noteId, debouncedSave);
    }

    debouncedSave();
  },
});

export default editorMiddleware;
