import { NoteCustomization } from "@darkwrite/common/models";
import { Editor, EditorContent as JSONContent } from "@darkwrite/editor";
import { create } from "zustand";

type editorState = {
  content: JSONContent;
  customizations: NoteCustomization;
  editorInstance: Editor | null;
};

type editorStateAction = {
  setContent: (content: JSONContent) => void;
  setCustomzations: (data: NoteCustomization) => void;
  setEditorInstance: (editor: Editor | null) => void;
  getSerializableObject: () => {
    content: JSONContent;
    customizations: NoteCustomization;
  };
  resetState: () => void;
};

export const useEditorState = create<editorState & editorStateAction>()(
  (set, get) => ({
    content: {},
    customizations: {},
    editorInstance: null,
    setContent(content) {
      set({ content });
    },
    setCustomzations(customizations) {
      set({ customizations });
    },
    setEditorInstance(editor) {
      set({ editorInstance: editor });
    },
    getSerializableObject() {
      return {
        customizations: get().customizations,
        content: get().content,
      };
    },
    resetState() {
      set({
        content: {},
        customizations: {},
        editorInstance: null,
      });
    },
  }),
);

export const setEditorContent = (content: JSONContent) =>
  useEditorState.setState({ content });
export const setEditorCustomizations = (customizations: NoteCustomization) =>
  useEditorState.setState({ customizations });
