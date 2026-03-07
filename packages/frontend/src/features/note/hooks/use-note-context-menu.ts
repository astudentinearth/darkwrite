import { useNoteActions } from "@/features/note/store/note-actions";
import { selectNoteById } from "@/features/note/store/note-selectors";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { useNoteExport } from "@/features/export/note-exporter";
import { MoveNoteDialogPortal } from "../store/notes-ui-actions";

export const useNoteContextMenu = (noteId: string) => {
  const note = useAppSelector((state) => selectNoteById(state, noteId));
  const { createNote, duplicateNote, moveToTrash } = useNoteActions();
  const exporter = useNoteExport();
  const dispatch = useAppDispatch();

  const exportPDF = () => {
    exporter.exportPDF(noteId);
  };

  const exportHTML = () => {
    exporter.exportHTML(noteId);
  };

  const exportJSON = () => {
    exporter.exportJSON(noteId);
  };

  const newSubpage = () => {
    if (!note) return;
    createNote({
      workspaceId: note.workspaceId,
      navigateAfter: true,
      parentId: note.id,
    });
  };

  const trash = () => moveToTrash(noteId);
  const duplicate = () => duplicateNote(noteId);

  const move = () => {
    MoveNoteDialogPortal(dispatch).showMoveNoteDialog(noteId);
  };

  return {
    newSubpage,
    trash,
    duplicate,
    exportHTML,
    exportJSON,
    exportPDF,
    move,
  };
};
