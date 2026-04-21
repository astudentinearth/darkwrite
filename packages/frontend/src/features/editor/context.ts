import { NoteDTO } from "@darkwrite/common";
import { Editor } from "@tiptap/core";
import { createContext } from "react";
import { ImageExtensionConfig } from "./extensions/image/image-config";
import { EditorContent, SlashCommandItem } from "./types";

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
  noteId: string;
  showTextDirectionControls?: boolean;
}

export const DarkwriteEditorContext = createContext<IDarkwriteEditorContext>({
  onContentChange: () => {},
  commandItems: [],
  codeBlockIndentSize: 4,
  embedSourceResolver: () => new Promise(() => ""),
  imageUploadConfig: {} as ImageExtensionConfig,
  noteId: "",
});
