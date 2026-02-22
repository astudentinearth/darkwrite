import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteContent } from "@/common/note-content";
import { NoteCustomization } from "@/common/note-customization";
import { Editor, EditorContent } from "@/features/editor/types";
import { persistContentDebounced } from "@/query/use-note-content";
import { create } from "zustand";

export interface EditorStore {
  /** @deprecated */
  editor?: Editor;
  /**
   * @deprecated use redux selectors
   */
  content: EditorContent;
  /**
   * @deprecated use redux selectors
   */
  customizations: NoteCustomization;
  noteId: string;
  width: number;
}

export const useEditorStore = create<EditorStore>()(() => ({
  content: {},
  customizations: {},
  noteId: "",
  width: 800,
}));

export const setActiveEditorInstance = (editor?: Editor) => {
  useEditorStore.setState({ editor });
};

/** @deprecated use `editorSlice.actions.initializeDocument`
 */
export function initializeEditor(noteId: string, document: NoteContent) {
  useEditorStore.setState({
    content: document.contents,
    customizations: document.customizations,
    noteId,
  });
}

/** @deprecated */
export function setEditorCustomizations(
  customizations: NoteCustomization,
  debounce = false,
) {
  useEditorStore.setState({ customizations });
  saveContents(debounce);
}
