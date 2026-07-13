import type { NoteDTO } from "@darkwrite/common";
import type { Editor } from "@tiptap/core";
import { createContext } from "react";
import type { ImageExtensionConfig } from "./extensions/image/image-config";
import type { EditorContent, SlashCommandItem } from "./types";

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
  openFilesOnDoubleClick?: boolean;
  editable: boolean;
}

export const DarkwriteEditorContext = createContext<IDarkwriteEditorContext>({
  onContentChange: () => {},
  commandItems: [],
  codeBlockIndentSize: 4,
  embedSourceResolver: () => new Promise(() => ""),
  imageUploadConfig: {} as ImageExtensionConfig,
  noteId: "",
  editable: true,
});
