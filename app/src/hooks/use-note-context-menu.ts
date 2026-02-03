import { NoteExporter } from "@/features/export/note-exporter";
import {
  createNote,
  duplicateNote,
  moveToTrash,
} from "@/features/note/store/note-actions";
import { selectNoteById } from "@/features/note/store/note-selectors";
import { store } from "@/features/store/redux";

export const useNoteContextMenu = (noteId: string) => {
  const exportPDF = () => {
    NoteExporter.exportPDF(noteId);
  };

  const exportHTML = () => {
    NoteExporter.exportHTML(noteId);
  };

  const exportJSON = () => {
    NoteExporter.exportJSON(noteId);
  };

  const newSubpage = () => {
    const note = selectNoteById(store.getState(), noteId);
    if (!note) return;
    createNote({
      workspaceId: note.workspaceId,
      navigateAfter: true,
      parentId: note.id,
    });
  };

  const trash = () => moveToTrash(noteId);
  const duplicate = () => duplicateNote(noteId);

  return {
    newSubpage,
    trash,
    duplicate,
    exportHTML,
    exportJSON,
    exportPDF,
  };
};
