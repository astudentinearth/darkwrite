import { EditorContent, SlashCommandItem } from "./types";
import { Editor } from "@tiptap/core";
import { createContext } from "react";
import { NoteDTO } from "@/common/dto";
import { ImageExtensionConfig } from "./extensions/image/image-config";

export interface IDarkwriteEditorContext {
  notes?: NoteDTO[];
  onContentChange: (newContent: EditorContent) => void;
  onUpdate?: (editor: Editor) => void;
  onCreate?: (editor: Editor) => void;
  onNavigateToNote?: (noteId: string) => void;
  commandItems: SlashCommandItem[];
  codeBlockIndentSize: number;
  embedSourceResolver: (id: string) => Promise<string>;
  imageUploadConfig: ImageExtensionConfig;
}

export const DarkwriteEditorContext = createContext<IDarkwriteEditorContext>({
  onContentChange: () => {},
  commandItems: [],
  codeBlockIndentSize: 4,
  embedSourceResolver: () => new Promise(() => ""),
  imageUploadConfig: {} as ImageExtensionConfig,
});
