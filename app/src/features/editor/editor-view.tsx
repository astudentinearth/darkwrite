import { useNoteById } from "@/query/use-note-by-id";
import { useNoteFromURL } from "@/query/use-note-from-url";

export function EditorViewRouteHandler() {
  const noteId = useNoteFromURL();
  if (!noteId) return "Not found";
  return <EditorView key={`editor-root-${noteId}`} noteId={noteId}/>;
}

export function EditorView({noteId}: {noteId: string}) {
  const {note} = useNoteById(noteId);
  return <div>{note && note.title}</div>;
}
