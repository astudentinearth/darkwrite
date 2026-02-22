import { DarkwriteAPIClient } from "@/api/api-client";
import {
  initializeEditor,
  setActiveEditorInstance,
  setEditorContent,
  useEditorStore,
} from "@/context/editor-store";
import useEditorCover from "@/hooks/editor/use-editor-cover";
import { useEditorOptions } from "@/hooks/editor/use-editor-options";
import { useNoteFromURL } from "@/query/use-note-from-url";
import { useEffect, useState } from "react";
import DarkwriteEditor from ".";
import ConstrainedWidth from "./constrained-width";
import { useSlashCommand } from "./extensions";
import EditorHeader from "./header";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";
import { useLocalStore } from "@/context/local-state";
import { useSettings } from "../settings/store/settings-selectors";
import { useNoteById } from "../note/hooks/use-note-by-id";

export function EditorViewRouteHandler() {
  const noteId = useNoteFromURL();
  const { note } = useNoteById(noteId ?? "");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!noteId) return;
    setLoaded(false);
    DarkwriteAPIClient.note.getDocument(noteId).then((val) => {
      initializeEditor(noteId, val.document);
      setLoaded(true);
    });
  }, [noteId]);
  if (!noteId) return "Not found";
  if (!note) return null;
  if (!loaded) return null;
  return <EditorView key={`editor-root-${noteId}`} noteId={noteId} />;
}

export function EditorView({ noteId }: { noteId: string }) {
  const { note } = useNoteById(noteId);
  const options = useEditorOptions();
  const settings = useSettings();
  const contents = useEditorStore((s) => s.content);
  const customizations = useEditorStore((s) => s.customizations);
  const content = { contents, customizations };
  const initialContent = useEditorStore.getState().content;
  const navToNote = useNavigateToNote();
  const spellcheck = useLocalStore((s) => s.useSpellcheck);

  const cover = useEditorCover(noteId);
  const { items } = useSlashCommand(options.imageConfig);
  return (
    <div
      data-editor-boundary="true"
      className="flex items-center flex-col px-24 editor-fade-in min-h-full relative gap-2"
      style={options.style}
      spellCheck={spellcheck}
    >
      {note && <EditorHeader />}
      <ConstrainedWidth fill={content?.customizations.widePage}>
        {/*false && (
          <DarkwriteEditor
            content={initialContent}
            commandItems={items}
            onContentChange={(val) => setEditorContent(val)}
            imageUploadConfig={options.imageConfig}
            codeBlockIndentSize={settings.editor.codeIndentSize}
            embedSourceResolver={async (id) =>
              (await DarkwriteAPIClient.embed.getById(id)).embed?.url ?? ""
            }
            notes={Object.values(notes ?? {})}
            key={noteId}
            onNavigateToNote={navToNote}
            onInstanceChange={setActiveEditorInstance}
          />
        )*/}
      </ConstrainedWidth>
    </div>
  );
}
