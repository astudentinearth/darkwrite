import { DarkwriteEditorContext, IDarkwriteEditorContext } from "./context";
import { EditorRoot } from "./editor-root";
import "../globals.css";
import "./css/handle.css";
import "./css/editor.css";
import "./css/lists.css";
import "./css/text.css";
import { I18nextProvider } from "react-i18next";

export type DarkwriteEditorProps = IDarkwriteEditorContext;

export default function DarkwriteEditor(props: DarkwriteEditorProps) {
  return (
    <DarkwriteEditorContext.Provider value={props}>
      <I18nextProvider i18n={props.i18n}>
        <EditorRoot />
      </I18nextProvider>
    </DarkwriteEditorContext.Provider>
  );
}

export {DarkwriteEditor}
