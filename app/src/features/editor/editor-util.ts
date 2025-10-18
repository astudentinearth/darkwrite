import { Editor } from "@tiptap/core";
import { UtilityNodes } from "./node-types";
import { useCurrentEditor } from "@tiptap/react";
import { MarkdownConverter } from "@/common/markdown";

export default function EditorUtil(editor: Editor) {
  return {
    getJSON() {
      return editor.getJSON();
    },

    getHTML() {
      return editor.getHTML();
    },

    getActiveHeading() {
      for (let i = 1; i < 5; i++) {
        if (editor.isActive("heading", { level: i })) return i;
      }
      return null;
    },

    getActiveList() {
      const lists = ["bulletList", "toDoList", "numberedList"];
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

    insertMarkdown(markdown: string) {
      const html = MarkdownConverter.convertMarkdownToHTML(markdown);
      editor
        .chain()
        .focus()
        .insertContentAt(editor.state.doc.content.size, html)
        .run();
    },
  };
}

export const useEditorUtil = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;
  return EditorUtil(editor);
};
