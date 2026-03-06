import { NoteExporter } from "@/features/export/note-exporter";
import useNoteImport from "@/features/note/hooks/use-note-import";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { useNoteActions } from "@/features/note/store/note-actions";
import { emitEditorEvent } from "../event/editor-bus";
import { EditorEventType } from "../event/types";
import { useAppSelector } from "@/features/store/hooks";
import {
  selectCanRedo,
  selectCanUndo,
  selectCharacterCount,
  selectWordCount,
} from "../store/editor-selectors";
import { showMoveNoteDialog } from "@/features/note/store/notes-ui-actions";

export interface EditorMenuActions {
  exportHTML: () => Promise<void>;
  exportJSON: () => Promise<void>;
  exportPDF: () => Promise<void>;
  importNotes: () => void;
  undo: () => void;
  redo: () => void;
  toggleTrash: () => void;
  move: () => void;
}

export interface UseEditorMenuResult {
  actions: EditorMenuActions;
  isTrashed: boolean;
  wordCount: number;
  characterCount: number;
  canUndo: boolean;
  canRedo: boolean;
}

export default function useEditorMenu(noteId: string): UseEditorMenuResult {
  const { note } = useNoteById(noteId);
  const importer = useNoteImport(noteId);
  const wordCount = useAppSelector((s) => selectWordCount(s, noteId));
  const characterCount = useAppSelector((s) => selectCharacterCount(s, noteId));
  const canUndo = useAppSelector((s) => selectCanUndo(s, noteId));
  const canRedo = useAppSelector((s) => selectCanRedo(s, noteId));
  const { moveToTrash, restoreFromTrash } = useNoteActions();

  const actions: EditorMenuActions = {
    exportHTML: () => NoteExporter.exportHTML(noteId),
    exportJSON: () => NoteExporter.exportJSON(noteId),
    exportPDF: () => NoteExporter.exportPDF(noteId),
    importNotes: importer.importNotes,
    move: () => showMoveNoteDialog(noteId),
    undo: () =>
      emitEditorEvent({
        noteId,
        type: EditorEventType.HISTORY,
        payload: "undo",
      }),
    redo: () =>
      emitEditorEvent({
        noteId,
        type: EditorEventType.HISTORY,
        payload: "redo",
      }),
    toggleTrash: () => {
      if (note?.isTrashed) restoreFromTrash(noteId);
      else moveToTrash(noteId);
    },
  };

  return {
    actions,
    isTrashed: note?.isTrashed ?? false,
    wordCount,
    characterCount,
    canUndo,
    canRedo,
  };
}
