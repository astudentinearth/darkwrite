import { useEditorStore } from "@/context/editor-store";
import EditorUtil from "./editor-util";

export function useEditorCommand() {
  const editor = useEditorStore((s) => s.editor);
  return { get: () => (editor ? EditorUtil(editor) : null) };
}
