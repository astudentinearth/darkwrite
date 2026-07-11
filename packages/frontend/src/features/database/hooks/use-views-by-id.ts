import { skipToken } from "@reduxjs/toolkit/query";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "@/features/store/hooks";
import { selectDatabaseViewById } from "../store/database-selectors";
import { useGetViewsByIdQuery } from "../store/database-view-api";

const EMPTY_ARRAY: never[] = [];

/**
 * Fetches multiple database views by their IDs (regardless of which database
 * they belong to) and returns both the note IDs and their view metadata from
 * the central Redux store.
 */
export function useViewsById(ids: string[] | undefined) {
  const hasIds = ids && ids.length > 0;
  const { isFetching, isLoading } = useGetViewsByIdQuery(
    hasIds ? ids : skipToken,
  );

  const views = useAppSelector(
    (s) =>
      hasIds
        ? ids.map((id) => selectDatabaseViewById(s, id)).filter(Boolean)
        : EMPTY_ARRAY,
    shallowEqual,
  );

  return {
    views,
    isFetching,
    isLoading,
  };
}
