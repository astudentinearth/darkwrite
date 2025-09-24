import { DarkwriteEditorContext, IDarkwriteEditorContext } from "./context";
import { EditorRoot } from "./editor-root";
import "./css/handle.css";
import "./css/editor.css";
import "./css/lists.css";
import "./css/text.css";

export type DarkwriteEditorProps = IDarkwriteEditorContext;

export default function DarkwriteEditor(props: DarkwriteEditorProps) {
  return (
    <DarkwriteEditorContext.Provider value={props}>
        <EditorRoot />
    </DarkwriteEditorContext.Provider>
  );
}

export {DarkwriteEditor}
