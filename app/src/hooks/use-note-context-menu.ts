import { usePersistedNoteExport } from "./use-note-export";
import { selectNoteById } from "@/features/note/store/note-selectors";
import { store } from "@/features/store/redux";
import { createNoteApi } from "@/features/note/store/create-note";

export const useNoteContextMenu = (noteId: string) => {
  const { update } = useUpdateNote();
  const duplicateMutation = useDuplicateNote();

  const { exportHTML, exportJSON, exportPdf } = usePersistedNoteExport(noteId);

  const newSubpage = () => {
    const note = selectNoteById(store.getState(), noteId);
    if (!note) return;
    createNoteApi.endpoints.createNote.initiate({
      workspaceId: note.workspaceId,
      navigateAfter: true,
      parentId: note.parentId,
    });
  };

  const trash = () => update({ id: note.id, dto: { isTrashed: true } });

  const duplicate = () => {
    duplicateMutation.mutate(note.id);
  };

  return {
    newSubpage,
    trash,
    duplicate,
    exportHTML,
    exportJSON,
    exportPdf,
  };
};
