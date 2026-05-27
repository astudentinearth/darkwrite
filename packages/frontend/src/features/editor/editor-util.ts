import { MarkdownConverter } from "@darkwrite/common";
import type { Editor } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";
import { UtilityNodes } from "./node-types";
import type { FormattingState } from "./store/editor-slice";
import {
  type HeadingLevel,
  ListType,
  TextDirection,
  TextFormat,
} from "./types";

export default function EditorUtil(editor: Editor) {
  return {
    getJSON() {
      return editor.getJSON();
    },

    getHTML() {
      return editor.getHTML();
    },

    getActiveHeading(): HeadingLevel | null {
      for (let i = 1; i < 5; i++) {
        if (editor.isActive("heading", { level: i })) return i as HeadingLevel;
      }
      return null;
    },

    getActiveList(): ListType | null {
      const lists: ListType[] = [
        ListType.Bullet,
        ListType.Ordered,
        ListType.Task,
      ];
      for (const list of lists) if (editor.isActive(list)) return list;
      return null;
    },

    insertParagraphBelow() {
      const pos = editor.state.selection.to;
      editor
        .chain()
        .focus()
        .insertContentAt(pos, UtilityNodes.EmptyParagraph)
        .run();
    },

    insertParagraphAbove() {
      const pos = editor.state.selection.from;
      editor
        .chain()
        .focus()
        .insertContentAt(pos, UtilityNodes.EmptyParagraph)
        .run();
    },

    insertParagraphAtEnd() {
      const pos = editor.state.doc.content.size;
      editor
        .chain()
        .focus()
        .insertContentAt(pos, UtilityNodes.EmptyParagraph)
        .run();
    },

    getHeadings() {
      const headings = editor.$nodes("heading");
      return (
        headings?.map((node) => ({
          text: node.textContent,
          level: node.attributes.level as number,
          pos: node.pos,
        })) || []
      );
    },

    getTodos() {
      type Todo = {
        text: string;
        checked: boolean;
        depth: number;
        pos: number;
      };
      const items = editor.$nodes("taskItem");
      return (
        items?.map(
          (item) =>
            ({
              text: item.textContent,
              checked: !!item.attributes.checked,
              depth: item.depth,
              pos: item.pos,
            }) satisfies Todo,
        ) || []
      );
    },

    getEndPos() {
      const pos = editor.state.doc.content.size;
      return pos;
    },

    canUndo() {
      return editor.can().undo;
    },

    canRedo() {
      return editor.can().redo;
    },

    undo() {
      editor.chain().focus().undo().run();
    },

    redo() {
      editor.chain().focus().redo().run();
    },

    insertHTML(html: string) {
      editor
        .chain()
        .focus()
        .insertContentAt(editor.state.doc.content.size, html)
        .run();
    },

    insertJSON(json: object) {
      editor
        .chain()
        .focus()
        .insertContentAt(editor.state.doc.content.size, json)
        .run();
    },

    countWords() {
      return editor.storage.characterCount.words();
    },

    countCharacters() {
      return editor.storage.characterCount.characters();
    },
    insertMarkdown(markdown: string) {
      const html = MarkdownConverter.convertMarkdownToHTML(markdown);
      editor
        .chain()
        .focus()
        .insertContentAt(editor.state.doc.content.size, html)
        .run();
    },

    getFormattingState(): FormattingState {
      return {
        isBold: editor.isActive(TextFormat.Bold),
        isItalic: editor.isActive(TextFormat.Italic),
        isUnderline: editor.isActive(TextFormat.Underline),
        isStrikethrough: editor.isActive(TextFormat.Strike),
        isCode: editor.isActive(TextFormat.Code),
        isQuote: editor.isActive(TextFormat.Quote),
        isLink: editor.isActive(TextFormat.Link),
        currentLinkUrl: editor.getAttributes(TextFormat.Link).href,
        textDirection:
          editor.getAttributes("paragraph").dir || TextDirection.Auto,
      };
    },
  };
}

export const useEditorUtil = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;
  return EditorUtil(editor);
};
