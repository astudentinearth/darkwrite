import { skipToken } from "@reduxjs/toolkit/query";
import { shallowEqual } from "react-redux";
import { selectNotesInDatabase } from "@/features/note/store/note-selectors";
import { useGetNotesInDatabaseQuery } from "@/features/note/store/notes-api";
import { useAppSelector } from "@/features/store/hooks";

const EMPTY_ARRAY: never[] = [];

/**
 * Fetches notes (Doc type) that belong to the given database and selects
 * their IDs from the central Redux store.
 */
export function useNotesInDatabase(databaseId: string | undefined) {
  const { isFetching, isLoading } = useGetNotesInDatabaseQuery(
    databaseId ?? skipToken,
  );
  const noteIds = useAppSelector(
    (s) => (databaseId ? selectNotesInDatabase(s, databaseId) : EMPTY_ARRAY),
    shallowEqual,
  );
  return {
    noteIds,
    isFetching,
    isLoading,
  };
}
