import { useAppSelector } from "@/features/store/hooks";
import { useGetDocumentQuery } from "../store/editor-api";
import { skipToken } from "@reduxjs/toolkit/query";
import type { NoteContent } from "@darkwrite/common";

export type useDocumentResult = {
  document: NoteContent | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
};

export function useDocumentById(noteId: string): useDocumentResult {
  const document = useAppSelector((state) => state.editor.docs[noteId]);
  const { isLoading, isFetching, isError } = useGetDocumentQuery(
    document ? skipToken : noteId,
  );

  return {
    document,
    isLoading,
    isFetching,
    isError,
  };
}
