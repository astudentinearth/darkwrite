import { DarkwriteAPIClient } from "@/api/api-client";
import { useLocalStore } from "@/context/local-state";
import { useEditorOptions, useEditorView } from "./hooks/use-editor-options";
import { useNoteFromURL } from "@/features/note/hooks/use-note-from-url";
import { use } from "react";
import DarkwriteEditor from ".";
import { navigateToNote } from "../navigation/navigator";
import { useAppSelector } from "../store/hooks";
import ConstrainedWidth from "./constrained-width";
import { useSlashCommand } from "./extensions";
import EditorHeader from "./header";
import { useDocumentById } from "./hooks/use-document";
import { EditorContext } from "./store/editor-context";
import {
  selectEditorContent,
  selectEditorCustomizations,
} from "./store/editor-selectors";
import { useEditorSettings } from "../settings/hooks/use-settings";

export function EditorViewRouteHandler() {
  const noteId = useNoteFromURL();
  const { document } = useDocumentById(noteId ?? "");
  if (!noteId) return null;
  return (
    document && (
      <EditorContext.Provider value={{ noteId }}>
        <EditorView key={`editor-root-${noteId}`} noteId={noteId} />
      </EditorContext.Provider>
    )
  );
}

function EditorViewport() {
  const { noteId } = use(EditorContext);

  const options = useEditorOptions();
  const customizations = useAppSelector((s) =>
    selectEditorCustomizations(s, noteId),
  );
  const content = useAppSelector((s) => selectEditorContent(s, noteId));
  const settings = useEditorSettings();
  const { items } = useSlashCommand(options.imageConfig);
  if (!content || !customizations) return null;
  return (
    <ConstrainedWidth fill={customizations?.widePage}>
      <DarkwriteEditor
        content={content}
        commandItems={items}
        onContentChange={options.handleContentChange}
        onUpdate={options.onUpdate}
        onCreate={options.onCreate}
        imageUploadConfig={options.imageConfig}
        codeBlockIndentSize={settings.codeIndentSize}
        embedSourceResolver={async (id) =>
          (await DarkwriteAPIClient.embed.getById(id)).embed?.url ?? ""
        }
        key={noteId}
        onNavigateToNote={navigateToNote}
      />
    </ConstrainedWidth>
  );
}

export function EditorView({ noteId }: { noteId: string }) {
  const spellcheck = useLocalStore((s) => s.useSpellcheck);
  const { style } = useEditorView(noteId);

  return (
    <div
      data-editor-boundary="true"
      className="flex items-center flex-col px-24 editor-fade-in min-h-full relative gap-2"
      style={style}
      spellCheck={spellcheck}
    >
      <EditorHeader />
      <EditorViewport />
    </div>
  );
}
