import { IconArrowsMaximize } from "@tabler/icons-react";
import { Expand } from "lucide-react";
import { use } from "react";
import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { navigateToNote } from "@/features/navigation/navigator";
import { useEditorActions } from "../store/editor-actions";
import { EditorContext } from "../store/editor-context";

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
        <IconArrowsMaximize size={20} />
      </HeaderbarButton>
    </TextTooltip>
  );
}
