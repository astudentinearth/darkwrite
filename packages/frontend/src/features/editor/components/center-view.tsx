import { Dialog, DialogContent } from "@/components/ui";
import Toolbar from "@/features/layout/toolbar";
import { useAppSelector } from "@/features/store/hooks";
import { cn } from "@/lib/utils";
import { EditorViewport } from "../editor-view";
import { NoteMetadataEditors } from "../header";
import { useDocumentById } from "../hooks/use-document";
import { useEditorActions } from "../store/editor-actions";
import { EditorContext } from "../store/editor-context";
import { selectCenterViewState } from "../store/editor-selectors";
import { OpenFullscreenButton } from "./open-fullscreen-button";
import { use, useRef } from "react";
import { nanoid } from "nanoid";
import { useEditorView } from "../hooks/use-editor-options";
import { navigateToNote } from "@/features/navigation/navigator";

export function EditorCenterView() {
  const { open, noteId } = useAppSelector(selectCenterViewState);
  const actions = useEditorActions();
  const instanceId = useRef(nanoid()).current;
  useDocumentById(noteId ?? "");
  if (!noteId) return <></>;

  return (
    <EditorContext.Provider value={{ noteId, instanceId }}>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen) actions.closeCenterView();
        }}
      >
        <CenterViewContent />
      </Dialog>
    </EditorContext.Provider>
  );
}

function CenterViewContent() {
  const actions = useEditorActions();
  const { noteId } = use(EditorContext);
  const { style } = useEditorView(noteId);
  return (
    <DialogContent
      hideX
      className={cn(
        "lg:max-w-240 max-w-[calc(100vw - 4rem)] h-[80vh] flex flex-col p-2 pr-0",
      )}
      style={style}
    >
      <div className="w-full flex z-10 pr-2">
        <OpenFullscreenButton />
        <div className="grow" />
        <Toolbar noteId={noteId} />
      </div>
      <div className="h-full overflow-y-auto scroll-view w-full">
        <div className="px-20 w-full flex flex-col gap-2 mt-16">
          <NoteMetadataEditors />
          <hr />
        </div>
        <div className="px-16 w-full pt-4">
          <EditorViewport
            unconstrainedWidth
            onNavigate={(id) => {
              actions.closeCenterView();
              navigateToNote(id);
            }}
          />
        </div>
      </div>
    </DialogContent>
  );
}
