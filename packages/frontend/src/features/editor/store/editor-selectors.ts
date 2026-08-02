import type { RootState } from "@/features/store/types";

export const selectEditorCustomizations = (state: RootState, noteId: string) =>
  state.editor.docs[noteId]?.customizations;

export const selectEditorContent = (state: RootState, noteId: string) =>
  state.editor.docs[noteId]?.contents;

export const selectCoverImageSource = (state: RootState, noteId: string) =>
  state.editor.docs[noteId]?.customizations.coverImageSource;

export const selectIsWidePage = (state: RootState, noteId: string) =>
  state.editor.docs[noteId]?.customizations.widePage ?? false;

export const selectWordCount = (state: RootState, noteId: string) =>
  state.editor.wordCount[noteId] ?? 0;

export const selectCharacterCount = (state: RootState, noteId: string) =>
  state.editor.characterCount[noteId] ?? 0;

export const selectCanUndo = (state: RootState, noteId: string) =>
  state.editor.canUndo[noteId] ?? false;

export const selectCanRedo = (state: RootState, noteId: string) =>
  state.editor.canRedo[noteId] ?? false;

export const selectFormattingState = (state: RootState, noteId: string) =>
  state.editor.formattingState[noteId] ?? null;

export const selectCenterViewState = (state: RootState) =>
  state.editor.centerView;

export const selectContentLoaded = (state: RootState, noteId: string) =>
  !!state.editor.docs[noteId];
