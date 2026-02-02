import { useAppSelector } from "@/features/store/hooks";
import { selectNoteById } from "../store/note-selectors";
import { useGetNoteByIdQuery } from "../store/notes-api";
import { skipToken } from "@reduxjs/toolkit/query";

export function useNoteById(id: string | undefined) {
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
