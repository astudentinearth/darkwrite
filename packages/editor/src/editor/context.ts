import { EditorContent, SlashCommandItem } from "@/types"
import { Editor } from "@tiptap/core";
import { createContext } from "react";
import { Note } from "@darkwrite/common";

export interface IDarkwriteEditorContext {
  content: EditorContent;
  notes?: Note[];
  onContentChange: (newContent: EditorContent) => void;
  /** A function to be called when the editor instance changes. Use this to life the editor instance higher in the tree. */
  onInstanceChange?: (editor: Editor) => void;
  onNavigateToNote?: (noteId: string) => void;
  commandItems: SlashCommandItem[];
  codeBlockIndentSize: number;
}

export const DarkwriteEditorContext = createContext<IDarkwriteEditorContext>({
  content: {},
  onContentChange: ()=>{},
  commandItems: [],
  codeBlockIndentSize: 4
});
