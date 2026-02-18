import { NoteContent } from "@/common/note-content";
import { NoteCustomization } from "@/common/note-customization";
import { createSlice } from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";

export const EDITOR_SLICE_NAME = "editor";

export interface EditorState {
  docs: Record<string, NoteContent>;
}

export const editorSlice = createSlice({
  name: EDITOR_SLICE_NAME,
  reducers: {
    initializeDocument: (
      state,
      action: { payload: { noteId: string; document: NoteContent } },
    ) => {
      const { noteId, document } = action.payload;
      state.docs[noteId] = document;
    },

    updateDocumentContent: (
      state,
      action: {
        payload: { noteId: string; content: JSONContent };
      },
    ) => {
      const { noteId, content } = action.payload;
      if (state.docs[noteId]) {
        state.docs[noteId].contents = content;
      }
    },

    updateDocumentCustomizations: (
      state,
      action: {
        payload: { noteId: string; customizations: NoteCustomization };
      },
    ) => {
      const { noteId, customizations } = action.payload;
      if (state.docs[noteId]) {
        state.docs[noteId].customizations = customizations;
      }
    },
  },
  initialState: { docs: {} } as EditorState,
});
