import type { DwResultAsync } from "@darkwrite/common";
import { use } from "react";
import { useNoteExport } from "@/features/export/note-exporter";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import useNoteImport from "@/features/note/hooks/use-note-import";
import {
  restoreFailToast,
  restoreSuccessToast,
  trashFailToast,
  trashSuccessToast,
} from "@/features/note/note.toast";
import {
  moveToTrash,
  restoreFromTrash,
} from "@/features/note/store/note.thunk";
import { MoveNoteDialogPortal } from "@/features/note/store/notes-ui-actions";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { emitEditorEvent } from "../event/editor-bus";
import { EditorEventType } from "../event/types";
import { EditorContext } from "../store/editor-context";
import {
  selectCanRedo,
  selectCanUndo,
  selectCharacterCount,
  selectWordCount,
} from "../store/editor-selectors";

export interface EditorMenuActions {
  exportHTML: () => DwResultAsync<string | undefined>;
  exportJSON: () => DwResultAsync<string | undefined>;
  exportPDF: () => DwResultAsync<string | undefined>;
  exportMarkdown: () => DwResultAsync<string | undefined>;
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
  const dispatch = useAppDispatch();
  const { instanceId } = use(EditorContext);
  const { note } = useNoteById(noteId);
  const importer = useNoteImport(noteId, instanceId);
  const NoteExporter = useNoteExport();
  const wordCount = useAppSelector((s) => selectWordCount(s, noteId));
  const characterCount = useAppSelector((s) => selectCharacterCount(s, noteId));
  const canUndo = useAppSelector((s) => selectCanUndo(s, noteId));
  const canRedo = useAppSelector((s) => selectCanRedo(s, noteId));

  const actions: EditorMenuActions = {
    exportHTML: () => NoteExporter.exportHTML(noteId),
    exportJSON: () => NoteExporter.exportJSON(noteId),
    exportPDF: () => NoteExporter.exportPDF(noteId),
    exportMarkdown: () => NoteExporter.exportMarkdown(noteId),
    importNotes: importer.importNotes,
    move: () => MoveNoteDialogPortal(dispatch).showMoveNoteDialog(noteId),
    undo: () =>
      emitEditorEvent({
        noteId,
        type: EditorEventType.HISTORY,
        payload: "undo",
        targetInstanceId: instanceId,
      }),
    redo: () =>
      emitEditorEvent({
        noteId,
        type: EditorEventType.HISTORY,
        payload: "redo",
        targetInstanceId: instanceId,
      }),
    toggleTrash: () => {
      if (note?.isTrashed)
        dispatch(restoreFromTrash(noteId))
          .andTee(restoreSuccessToast)
          .orTee(restoreFailToast);
      else
        dispatch(moveToTrash(noteId))
          .andTee(trashSuccessToast)
          .orTee(trashFailToast);
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
