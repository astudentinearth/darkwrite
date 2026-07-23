import { nanoid } from "nanoid";
import { use, useRef } from "react";
import { Dialog, DialogContentContainer, DialogOverlay } from "@/components/ui";
import NoteDropdown from "@/features/layout/note-dropdown";
import Toolbar from "@/features/layout/toolbar";
import { navigateToNote } from "@/features/navigation/navigator";
import { useAppSelector } from "@/features/store/hooks";
import { cn } from "@/lib/utils";
import { EditorViewport } from "../editor-view";
import { NoteMetadataEditors } from "../header";
import { useDocumentById } from "../hooks/use-document";
import { useEditorView } from "../hooks/use-editor-options";
import { useEditorActions } from "../store/editor-actions";
import { EditorContext } from "../store/editor-context";
import { selectCenterViewState } from "../store/editor-selectors";
import { OpenFullscreenButton } from "./open-fullscreen-button";
import { ReaderModeToggle } from "./reader-mode-toggle";

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
        <DialogOverlay className="fixed flex inset-0 w-screen h-screen items-center justify-center">
          <CenterViewContent />
        </DialogOverlay>
      </Dialog>
    </EditorContext.Provider>
  );
}

function CenterViewContent() {
  const actions = useEditorActions();
  const { noteId } = use(EditorContext);
  const { style } = useEditorView(noteId);

  return (
    <DialogContentContainer
      className={cn(
        "lg:max-w-240 overflow-hidden z-50 max-w-[calc(100vw - 4rem)] translate-none h-[80vh] flex flex-col p-2 pr-0 static",
      )}
      style={style}
    >
      <div className="w-full flex z-10 pr-2 gap-2">
        <OpenFullscreenButton />
        <ReaderModeToggle />
        <NoteDropdown id={noteId} />
        <div className="grow" />
        <Toolbar noteId={noteId} />
      </div>
      <div className="relative h-full overflow-y-auto scroll-view w-full">
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
    </DialogContentContainer>
  );
}
