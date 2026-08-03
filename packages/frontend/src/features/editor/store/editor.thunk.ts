import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { AppDispatch, AppGetState } from "@/features/store/types";
import { selectFullNoteContent } from "./editor-selectors";
import { editorSlice } from "./editor-slice";

export const loadNoteContent = (noteId: string) => (dispatch: AppDispatch) =>
  DarkwriteAPIClient.note
    .getDocument(noteId)
    .andTee(({ document }) =>
      dispatch(editorSlice.actions.initializeDocument({ noteId, document })),
    );

export const ensureNoteContent =
  (noteId: string) => (dispatch: AppDispatch, getState: AppGetState) => {
    const content = selectFullNoteContent(getState(), noteId);
    if (!content)
      return dispatch(loadNoteContent(noteId)).map((d) => d.document);
    return okAsync(content);
  };
