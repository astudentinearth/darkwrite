import type { NoteDTO } from "@darkwrite/common";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "@/features/store/hooks";
import { selectNoteById } from "../store/note-selectors";
import { useGetNoteByIdQuery } from "../store/notes-api";

interface NoteByIdResult {
  note: NoteDTO | null;
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export function useNoteById(id: string | undefined): NoteByIdResult {
  const note = useAppSelector((state) => selectNoteById(state, id ?? ""));
  const { isFetching, isError, isLoading, error } = useGetNoteByIdQuery(
    // skip if available, also skip if the id is empty
    note ? skipToken : id ? id : skipToken,
  );
  return {
    note: note || null,
    isFetching,
    isLoading,
    isError,
    error,
  };
}
