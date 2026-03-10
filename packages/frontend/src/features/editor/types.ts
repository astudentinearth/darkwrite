import { Editor, JSONContent, Range } from "@tiptap/core";
import { ReactNode } from "react";
export { type JSONContent as EditorContent };
export interface SlashCommandItem {
  id: string;
  icon: ReactNode;
  title: string;
  description?: string;
  keywords?: string[];
  command: (args: { editor: Editor; range: Range }) => void;
}

export type { Editor, Range };
