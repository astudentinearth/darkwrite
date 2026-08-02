import { DarkwriteAPIClient } from "@/api/api-client";
import type { AppDispatch } from "@/features/store/types";
import { editorSlice } from "./editor-slice";

export const loadNoteContent = (noteId: string) => (dispatch: AppDispatch) =>
  DarkwriteAPIClient.note
    .getDocument(noteId)
    .andTee(({ document }) =>
      dispatch(editorSlice.actions.initializeDocument({ noteId, document })),
    );
