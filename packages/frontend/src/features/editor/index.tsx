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
  const { content, ...context } = props;
  return (
    <DarkwriteEditorContext.Provider value={context}>
      <EditorRoot content={content} />
    </DarkwriteEditorContext.Provider>
  );
}

export { DarkwriteEditor };
