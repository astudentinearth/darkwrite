import type { NoteCustomization } from "@darkwrite/common";
import { useMemo } from "react";
import { useAppDispatch } from "@/features/store/hooks";
import type { AppDispatch } from "@/features/store/types";
import type { EditorContent } from "../types";
import { editorSlice, type FormattingState } from "./editor-slice";

/** @deprecated WHAT ABOUT JUST USING THE SLICE ACTIONS?? */
export const getEditorActions = (dispatch: AppDispatch) => ({
  setEditorCustomizations(
    noteId: string,
    customizations: Partial<NoteCustomization>,
  ) {
    dispatch(
      editorSlice.actions.updateDocumentCustomizations({
        noteId,
        customizations,
      }),
    );
  },

  setEditorContent(noteId: string, content: EditorContent) {
    dispatch(
      editorSlice.actions.updateDocumentContent({
        noteId,
        content,
      }),
    );
  },

  setWordCount(noteId: string, wordCount: number) {
    dispatch(
      editorSlice.actions.setWordCount({
        noteId,
        wordCount,
      }),
    );
  },

  setCharacterCount(noteId: string, characterCount: number) {
    dispatch(
      editorSlice.actions.setCharacterCount({
        noteId,
        characterCount,
      }),
    );
  },

  setCanUndo(noteId: string, canUndo: boolean) {
    dispatch(
      editorSlice.actions.setCanUndo({
        noteId,
        canUndo,
      }),
    );
  },

  setCanRedo(noteId: string, canRedo: boolean) {
    dispatch(
      editorSlice.actions.setCanRedo({
        noteId,
        canRedo,
      }),
    );
  },

  setFormattingState(noteId: string, formattingState: FormattingState) {
    dispatch(
      editorSlice.actions.setFormattingState({
        noteId,
        formattingState,
      }),
    );
  },

  showCenterView(noteId: string) {
    dispatch(editorSlice.actions.showCenterView(noteId));
  },

  closeCenterView() {
    dispatch(editorSlice.actions.closeCenterView());
  },

  setEditable(editable: boolean) {
    dispatch(editorSlice.actions.setEditable(editable));
  },
});

/** @deprecated WHAT ABOUT JUST USING THE SLICE ACTIONS?? */
export function useEditorActions() {
  const dispatch = useAppDispatch();
  const actions = useMemo(() => getEditorActions(dispatch), [dispatch]);
  return actions;
}
