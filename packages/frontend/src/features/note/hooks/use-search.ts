import _ from "lodash";
import { useMemo } from "react";
import { useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { selectByWorkspaceAndSearchTerm } from "../store/note-selectors";
import { useLazySearchQuery } from "../store/search-api";

export function useSearch(query: string) {
  const workspaceId = useCurrentWorkspaceId() ?? "";
  const [triggerSearch, { isError, isFetching, isLoading }] =
    useLazySearchQuery();

  const debouncedSearch = useMemo(
    () =>
      _.debounce((q: string) => triggerSearch({ workspaceId, query: q }), 150),
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
