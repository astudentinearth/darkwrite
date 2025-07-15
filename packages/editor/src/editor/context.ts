import { EditorContent, SlashCommandItem } from "@/types"
import { Editor } from "@tiptap/core";
import { createContext } from "react";
import { NoteDTO } from "@darkwrite/common";
import { ImageExtensionConfig } from "./extensions/image/image-config";
import i18n from "i18next"

export interface IDarkwriteEditorContext {
  content: EditorContent;
  notes?: NoteDTO[];
  onContentChange: (newContent: EditorContent) => void;
  /** A function to be called when the editor instance changes. Use this to life the editor instance higher in the tree. */
  onInstanceChange?: (editor: Editor) => void;
  onNavigateToNote?: (noteId: string) => void;
  commandItems: SlashCommandItem[];
  codeBlockIndentSize: number;
  embedSourceResolver: (id: string) => Promise<string>;
  imageUploadConfig: ImageExtensionConfig;
  i18n: typeof i18n;
}

export const DarkwriteEditorContext = createContext<IDarkwriteEditorContext>({
  content: {},
  onContentChange: ()=>{},
  commandItems: [],
  codeBlockIndentSize: 4,
  embedSourceResolver: () => new Promise(()=>""),
  imageUploadConfig: {} as ImageExtensionConfig,
  i18n: i18n
});
