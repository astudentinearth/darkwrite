import type { NoteContent, NoteCustomization } from "@darkwrite/common";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { JSONContent } from "@tiptap/core";
import _ from "lodash";
import type { TextDirection } from "../types";

export const EDITOR_SLICE_NAME = "editor";

export interface FormattingState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  isQuote: boolean;
  isLink: boolean;
  textDirection?: TextDirection;
  currentLinkUrl?: string;
}

export interface CenterViewState {
  noteId?: string;
  open: boolean;
}

export interface EditorState {
  docs: Record<string, NoteContent | undefined>;
  wordCount: Record<string, number>;
  characterCount: Record<string, number>;
  canUndo: Record<string, boolean>;
  canRedo: Record<string, boolean>;
  formattingState: Record<string, FormattingState>;
  centerView: CenterViewState;
}

const initialState: EditorState = {
  docs: {},
  characterCount: {},
  wordCount: {},
  canRedo: {},
  canUndo: {},
  formattingState: {},
  centerView: { open: false },
};

export const editorSlice = createSlice({
  name: EDITOR_SLICE_NAME,
  reducers: {
    /**
     * Initializes the document in the editor state when it is fetched from the server. Do NOT use for updates.
     */
    initializeDocument: (
      state,
      action: PayloadAction<{ noteId: string; document: NoteContent }>,
    ) => {
      const { noteId, document } = action.payload;
      state.docs[noteId] = document;
    },

    /**
     * Updates the contents of a document's **contents.** Does not touch style metadata.
     * _Updates made through this action will be automatically persisted through middleware._
     */
    updateDocumentContent: (
      state,
      action: PayloadAction<{ noteId: string; content: JSONContent }>,
    ) => {
      const { noteId, content } = action.payload;
      if (state.docs[noteId]) {
        state.docs[noteId].contents = content;
      }
    },

    updateDocumentCustomizations: (
      state,
      action: PayloadAction<{
        noteId: string;
        customizations: Partial<NoteCustomization>;
      }>,
    ) => {
      const { noteId, customizations } = action.payload;
      if (state.docs[noteId]) {
        _.merge(state.docs[noteId].customizations, customizations);
      }
    },

    setWordCount: (
      state,
      action: PayloadAction<{ noteId: string; wordCount: number }>,
    ) => {
      const { noteId, wordCount } = action.payload;
      state.wordCount[noteId] = wordCount;
    },

    setCharacterCount: (
      state,
      action: PayloadAction<{ noteId: string; characterCount: number }>,
    ) => {
      const { noteId, characterCount } = action.payload;
      state.characterCount[noteId] = characterCount;
    },

    setCanUndo: (
      state,
      action: PayloadAction<{ noteId: string; canUndo: boolean }>,
    ) => {
      const { noteId, canUndo } = action.payload;
      state.canUndo[noteId] = canUndo;
    },

    setCanRedo: (
      state,
      action: PayloadAction<{ noteId: string; canRedo: boolean }>,
    ) => {
      const { noteId, canRedo } = action.payload;
      state.canRedo[noteId] = canRedo;
    },

    setFormattingState: (
      state,
      action: PayloadAction<{
        noteId: string;
        formattingState: FormattingState;
      }>,
    ) => {
      const { noteId, formattingState } = action.payload;
      state.formattingState[noteId] = formattingState;
    },

    showCenterView: (state, action: PayloadAction<string>) => {
      state.centerView = {
        noteId: action.payload,
        open: true,
      };
    },

    closeCenterView: (state) => {
      state.centerView = {
        noteId: undefined,
        open: false,
      };
    },
  },
  initialState,
});
