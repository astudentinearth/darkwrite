import { Editor } from "@/features/editor/types";
import { create } from "zustand";

export interface EditorStore {
  editor?: Editor;
}

export const useEditorStore = create<EditorStore>()(()=>({}));

export const setActiveEditorInstance = (editor?: Editor) => {
  console.log("setting editor instance to:", editor);
  useEditorStore.setState({editor});
  console.log(useEditorStore.getState().editor);
}

