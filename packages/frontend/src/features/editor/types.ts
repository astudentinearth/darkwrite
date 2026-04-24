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

export enum ListType {
  Bullet = "bulletList",
  Ordered = "orderedList",
  Task = "taskList",
}

export enum TextFormat {
  Bold = "bold",
  Italic = "italic",
  Underline = "underline",
  Strike = "strike",
  Code = "code",
  Link = "link",
  Quote = "blockquote",
}

export enum Block {
  Blockquote = TextFormat.Quote, // shim to text format value
  CodeBlock = "codeBlock",
  Image = "dwimage",
  HorizontalRule = "horizontalRule",
  LinkToPage = "linkToPage",
  LinkToLocalFile = "fileLink",
}

export enum TextDirection {
  LeftToRight = "ltr",
  Auto = "auto",
  RightToLeft = "rtl",
}

export type HeadingLevel = 1 | 2 | 3 | 4;

export type { Editor, Range };
