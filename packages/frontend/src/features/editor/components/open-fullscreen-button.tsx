import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { navigateToNote } from "@/features/navigation/navigator";
import { Expand } from "lucide-react";
import { use } from "react";
import { EditorContext } from "../store/editor-context";
import { useEditorActions } from "../store/editor-actions";

export function OpenFullscreenButton() {
  const { noteId } = use(EditorContext);
  const actions = useEditorActions();

  return (
    <TextTooltip text="Expand">
      <HeaderbarButton
        onClick={() => {
          actions.closeCenterView();
          navigateToNote(noteId);
        }}
      >
        <Expand size={20} />
      </HeaderbarButton>
    </TextTooltip>
  );
}
