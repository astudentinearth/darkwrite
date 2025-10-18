import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteContent } from "@/common/note-content";
import { NoteCustomization } from "@/common/note-customization";
import { Editor, EditorContent } from "@/features/editor/types";
import { persistContentDebounced } from "@/query/use-note-content";
import { produce } from "immer";
import { create } from "zustand";

export interface EditorStore {
  editor?: Editor;
  content: EditorContent;
  customizations: NoteCustomization;
  noteId: string;
}

export const useEditorStore = create<EditorStore>()(() => ({
  content: {},
  customizations: {},
  noteId: "",
}));

export const setActiveEditorInstance = (editor?: Editor) => {
  useEditorStore.setState({ editor });
};

export function initializeEditor(noteId: string, document: NoteContent) {
  useEditorStore.setState({
    content: document.contents,
    customizations: document.customizations,
    noteId,
  });
}

function saveContents(debounce = true) {
  const state = useEditorStore.getState();
  const doc: NoteContent = {
    contents: state.content,
    customizations: state.customizations,
  };
  if (debounce) persistContentDebounced(state.noteId, JSON.stringify(doc));
  else DarkwriteAPIClient.note.setDocument(state.noteId, JSON.stringify(doc));
}

export function setEditorContent(value: EditorContent) {
  useEditorStore.setState({ content: value });
  saveContents();
}

export function setEditorCustomizations(
  customizations: NoteCustomization,
  debounce = false,
) {
  useEditorStore.setState({ customizations });
  saveContents(debounce);
}

export function currentDocumentToSerializable() {
  const state = useEditorStore.getState();
  const doc: NoteContent = {
    contents: state.content,
    customizations: state.customizations,
  };
  return doc;
}
