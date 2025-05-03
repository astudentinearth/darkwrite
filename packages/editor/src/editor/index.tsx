import { DarkwriteEditorContext, IDarkwriteEditorContext } from "./context";
import { EditorRoot } from "./editor-root";
import "../globals.css";
import "./css/handle.css";
import "./css/editor.css";
import "./css/lists.css";
import "./css/text.css";

export type DarkwriteEditorProps = IDarkwriteEditorContext;

export default function DarkwriteEditor(props: DarkwriteEditorProps) {
  const contextValue: IDarkwriteEditorContext = {
    content: props.content,
    onContentChange: props.onContentChange,
  };
  return (
    <DarkwriteEditorContext.Provider value={contextValue}>
      <EditorRoot />
    </DarkwriteEditorContext.Provider>
  );
}
