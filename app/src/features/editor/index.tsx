import { DarkwriteEditorContext, IDarkwriteEditorContext } from "./context";
import { EditorRoot } from "./editor-root";
import "./css/handle.css";
import "./css/editor.css";
import "./css/lists.css";
import "./css/text.css";
import "./css/table.css";
import { EditorContent } from "./types";

export type DarkwriteEditorProps = IDarkwriteEditorContext;

export default function DarkwriteEditor(
  props: DarkwriteEditorProps & { content: EditorContent },
) {
  return (
    <DarkwriteEditorContext.Provider value={props}>
      <EditorRoot content={props.content} />
    </DarkwriteEditorContext.Provider>
  );
}

export { DarkwriteEditor };
