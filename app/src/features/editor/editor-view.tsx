import useEditorCover from "@/hooks/editor/use-editor-cover";
import { useNoteById } from "@/query/use-note-by-id";
import { useNoteFromURL } from "@/query/use-note-from-url";
import EditorHeader from "./header";

export function EditorViewRouteHandler() {
  const noteId = useNoteFromURL();
  if (!noteId) return "Not found";
  return <EditorView key={`editor-root-${noteId}`} noteId={noteId} />;
}

export function EditorView({ noteId }: { noteId: string }) {
  const { note } = useNoteById(noteId);
  const cover = useEditorCover(noteId);
  return (
    <div>
      {note && (
        <EditorHeader
          icon={note.icon}
          title={note.title}
          onTitleChange={cover.updateTitle}
          onIconChange={() => {}}
          coverImageSource=""
          onCoverSourceChange={() => {}}
        />
      )}
    </div>
  );
}
