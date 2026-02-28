import { NoteCustomization } from "@/common/note-customization";
import { store } from "@/features/store/redux";
import { editorSlice } from "./editor-slice";
import { EditorContent } from "../types";

export function setEditorCustomizations(
  noteId: string,
  customizations: Partial<NoteCustomization>,
) {
  store.dispatch(
    editorSlice.actions.updateDocumentCustomizations({
      noteId,
      customizations,
    }),
  );
}

export function setEditorContent(noteId: string, content: EditorContent) {
  store.dispatch(
    editorSlice.actions.updateDocumentContent({
      noteId,
      content,
    }),
  );
}

export function setWordCount(noteId: string, wordCount: number) {
  store.dispatch(
    editorSlice.actions.setWordCount({
      noteId,
      wordCount,
    }),
  );
}

export function setCharacterCount(noteId: string, characterCount: number) {
  store.dispatch(
    editorSlice.actions.setCharacterCount({
      noteId,
      characterCount,
    }),
  );
}
