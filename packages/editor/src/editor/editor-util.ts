import { Editor } from "@tiptap/core";
import { UtilityNodes } from "./node-types";
import { useCurrentEditor } from "@tiptap/react";

export default class EditorUtil {
  constructor(private editor: Editor) {}

  public getJSON() {
    return this.editor.getJSON();
  }

  public getHTML() {
    return this.editor.getHTML();
  }

  public getActiveHeading() {
    for (let i = 1; i < 5; i++) {
      if (this.editor.isActive("heading", { level: i })) return i;
    }
    return null;
  }

  public getActiveList() {
    const lists = ["bulletList", "toDoList", "numberedList"];
    for (const list of lists) if (this.editor.isActive(list)) return list;
    return null;
  }

  public insertParagraphBelow() {
    const pos = this.editor.state.selection.to;
    this.editor
      .chain()
      .focus()
      .insertContentAt(pos, UtilityNodes.EmptyParagraph)
      .run();
  }

  public insertParagraphAbove() {
    const pos = this.editor.state.selection.from;
    this.editor
      .chain()
      .focus()
      .insertContentAt(pos, UtilityNodes.EmptyParagraph)
      .run();
  }

  public insertParagraphAtEnd(){
    const pos = this.editor.state.doc.content.size;
    this.editor
      .chain()
      .focus()
      .insertContentAt(pos, UtilityNodes.EmptyParagraph)
      .run();
  }

  public getHeadings() {
    const headings = this.editor.$nodes("heading");
    return (
      headings?.map((node) => ({
        text: node.textContent,
        level: node.attributes.level as number,
        pos: node.pos,
      })) || []
    );
  }

  public getTodos() {
    type Todo = { text: string; checked: boolean; depth: number; pos: number };
    const items = this.editor.$nodes("taskItem");
    return items?.map(item => ({
      text: item.textContent,
      checked: !!item.attributes.checked,
      depth: item.depth,
      pos: item.pos
    }) satisfies Todo) || [];
  }

  public getEndPos() {
    const pos = this.editor.state.doc.content.size;
    return pos;
  }

  public canUndo() {
    return this.editor.can().undo;
  }

  public canRedo() {
    return this.editor.can().redo;
  }

  public undo(){
    this.editor.chain().focus().undo().run();
  }

  public redo() {
    this.editor.chain().focus().redo().run();
  }

}

export const useEditorUtil = () => {
  const {editor} = useCurrentEditor();
  if(!editor) return null;
  return new EditorUtil(editor);
}
