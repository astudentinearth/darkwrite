import { DarkwriteAPIClient } from "@/api/api-client";
import {
  initializeEditor,
  setActiveEditorInstance,
  setEditorContent,
  useEditorStore,
} from "@/context/editor-store";
import useEditorCover from "@/hooks/editor/use-editor-cover";
import { useEditorOptions } from "@/hooks/editor/use-editor-options";
import { useNoteById } from "@/query/use-note-by-id";
import { useNoteFromURL } from "@/query/use-note-from-url";
import { useNotes } from "@/query/use-notes";
import { useEffect, useState } from "react";
import DarkwriteEditor from ".";
import ConstrainedWidth from "./constrained-width";
import { useSlashCommand } from "./extensions";
import EditorHeader from "./header";

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
  const notes = useNotes().notes;
  const options = useEditorOptions();
  const contents = useEditorStore((s) => s.content);
  const customizations = useEditorStore((s) => s.customizations);
  const content = { contents, customizations };
  const initialContent = useEditorStore.getState().content;

  const cover = useEditorCover(noteId);
  const { items } = useSlashCommand(options.imageConfig);
  return (
    <div
      data-editor-boundary="true"
      className="flex items-center flex-col px-24 editor-fade-in min-h-full relative"
      style={options.style}
    >
      {note && (
        <EditorHeader
          icon={note.icon}
          title={note.title}
          onTitleChange={cover.updateTitle}
          onIconChange={cover.updateIcon}
          coverImageSource={content?.customizations.coverImageSource}
          onCoverSourceChange={cover.onCoverImageSourceChange}
          wide={content?.customizations.widePage}
          onAddCover={cover.addCover}
        />
      )}
      <ConstrainedWidth fill={content?.customizations.widePage}>
        {content && (
          <DarkwriteEditor
            content={initialContent}
            commandItems={items}
            onContentChange={(val) => setEditorContent(val)}
            imageUploadConfig={options.imageConfig}
            codeBlockIndentSize={2}
            embedSourceResolver={async (id) =>
              (await DarkwriteAPIClient.embed.getById(id)).embed?.url ?? ""
            }
            notes={Object.values(notes ?? {})}
            key={noteId}
            onInstanceChange={setActiveEditorInstance}
          />
        )}
      </ConstrainedWidth>
    </div>
  );
}
