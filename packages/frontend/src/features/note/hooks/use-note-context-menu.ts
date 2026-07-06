import { useEditorActions } from "@/features/editor/store/editor-actions";
import { useNoteExport } from "@/features/export/note-exporter";
import { useNoteActions } from "@/features/note/store/note-actions";
import { selectNoteById } from "@/features/note/store/note-selectors";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { MoveNoteDialogPortal } from "../store/notes-ui-actions";

export const useNoteContextMenu = (noteId: string) => {
  const note = useAppSelector((state) => selectNoteById(state, noteId));
  const { createNote, duplicateNote, moveToTrash, createDatabase } =
    useNoteActions();
  const { showCenterView } = useEditorActions();
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

  const newDatabase = () => {
    if (!note) return;
    createDatabase({ parentId: note.id, workspaceId: note.workspaceId });
  };

  const trash = () => moveToTrash(noteId);
  const duplicate = () => duplicateNote(noteId);

  const move = () => {
    MoveNoteDialogPortal(dispatch).showMoveNoteDialog(noteId);
  };

  const openInCenter = () => showCenterView(noteId);

  return {
    newSubpage,
    trash,
    duplicate,
    exportHTML,
    exportJSON,
    exportPDF,
    move,
    openInCenter,
    newDatabase,
  };
};
