import { useEditorState } from "@renderer/context/editor-state";
import { useNavigate } from "react-router-dom";

export function useNavigateToNote() {
  const navigate = useNavigate();
  const forceSave = useEditorState((s) => s.forceSave);
  return async (id: string) => {
    await forceSave();
    navigate({ pathname: "/page", search: `?id=${id}` });
  };
}
