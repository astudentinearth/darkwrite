import { useEditorState } from "@renderer/context/editor-state";

export const useEditorStateManager = () => {
  const value = useEditorState((s) => s.content);
  const setValue = useEditorState((s) => s.setContent);
  const setEditor = useEditorState((s) => s.setEditorInstance);
  return { value, setValue, setEditor };
};
