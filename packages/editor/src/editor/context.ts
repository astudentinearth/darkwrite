import { EditorContent } from "@/types"
import { Editor } from "@tiptap/core";
import { createContext } from "react";

export interface IDarkwriteEditorContext {
  content: EditorContent;
  onContentChange: (newContent: EditorContent) => void;
  /** A function to be called when the editor instance changes. Use this to life the editor instance higher in the tree. */
  onInstanceChange?: (editor: Editor) => void;
}

export const DarkwriteEditorContext = createContext<IDarkwriteEditorContext>({
  content: {},
  onContentChange: ()=>{}
});
