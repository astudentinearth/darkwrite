import { skipToken } from "@reduxjs/toolkit/query";
import { shallowEqual } from "react-redux";
import { selectViewsOfDatabase } from "@/features/note/store/note-selectors";
import { useAppSelector } from "@/features/store/hooks";
import { useGetViewsOfQuery } from "../store/database-view-api";

const EMPTY_ARRAY: never[] = [];

/**
 * Fetches database views (DatabaseView type) that belong to the given database
 * and selects their IDs from the central Redux store.
 */
export function useViewsOfDatabase(databaseId: string | undefined) {
  const { isFetching, isLoading } = useGetViewsOfQuery(databaseId ?? skipToken);
  const viewIds = useAppSelector(
    (s) => (databaseId ? selectViewsOfDatabase(s, databaseId) : EMPTY_ARRAY),
    shallowEqual,
  );
  return {
    viewIds,
    isFetching,
    isLoading,
  };
}
