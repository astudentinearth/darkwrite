import { useEditorActions } from "@/features/editor/store/editor-actions";
import { useNoteExport } from "@/features/export/note-exporter";
import { selectNoteById } from "@/features/note/store/note-selectors";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { trashFailToast, trashSuccessToast } from "../note.toast";
import { createNote, duplicateNote, moveToTrash } from "../store/note.thunk";
import { MoveNoteDialogPortal } from "../store/notes-ui-actions";

export const useNoteContextMenu = (noteId: string) => {
  const note = useAppSelector((state) => selectNoteById(state, noteId));
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
    dispatch(createNote({ navigateAfter: true, parentId: note.id }));
  };

  const trash = () =>
    dispatch(moveToTrash(noteId))
      .andTee(trashSuccessToast)
      .orTee(trashFailToast);
  const duplicate = () => dispatch(duplicateNote(noteId));

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
  };
};
