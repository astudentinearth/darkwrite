import { EditorRoot } from "novel";
import { EditorContentWrapper, EditorProp } from "./editor-content";

export const TextEditor = ({ initialValue, onChange }: EditorProp) => {
  return (
    <EditorRoot>
      <EditorContentWrapper initialValue={initialValue} onChange={onChange} />
    </EditorRoot>
  );
};
