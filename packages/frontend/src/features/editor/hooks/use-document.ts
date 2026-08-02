import type { DwError, NoteContent } from "@darkwrite/common";
import { useEffect, useState } from "react";
import { useAppSelector, useAppStore } from "@/features/store/hooks";
import { loadNoteContent } from "../store/editor.thunk";
import { selectContentLoaded } from "../store/editor-selectors";

export type useDocumentResult = {
  document: NoteContent | undefined;
  error: DwError | null;
};

export function useDocumentById(noteId: string): useDocumentResult {
  const document = useAppSelector((state) => state.editor.docs[noteId]);
  const store = useAppStore();
  const [error, setError] = useState<DwError | null>(null);

  useEffect(() => {
    let active = true;
    setError(null);
    if (!selectContentLoaded(store.getState(), noteId))
      store
        .dispatch(loadNoteContent(noteId))
        .andTee(() => setError(null))
        .orTee((err) => active && setError(err));

    return () => {
      active = false;
    };
  }, [noteId, store]);

  return {
    document,
    error,
  };
}
