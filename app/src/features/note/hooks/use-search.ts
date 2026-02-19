import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { useLazySearchQuery, useSearchQuery } from "../store/search-api";
import { useMemo } from "react";
import _ from "lodash";
import { useAppSelector } from "@/features/store/hooks";
import { selectByWorkspaceAndSearchTerm } from "../store/note-selectors";

export function useSearch(query: string) {
  const workspaceId = useCurrentWorkspaceId() ?? "";
  const [triggerSearch, { isError, isFetching, isLoading }] =
    useLazySearchQuery();

  const debouncedSearch = useMemo(
    () =>
      _.debounce((q: string) => triggerSearch({ workspaceId, query: q }), 300),
    [triggerSearch, workspaceId],
  );

  const results = useAppSelector((s) =>
    selectByWorkspaceAndSearchTerm(s, { query, workspaceId }),
  );

  return {
    results,
    debouncedSearch,
    isError,
    isFetching,
    isLoading,
  };
}
