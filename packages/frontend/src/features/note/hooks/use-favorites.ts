import { skipToken } from "@reduxjs/toolkit/query";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { selectFavoriteIds } from "../store/note-selectors";
import { useGetFavoritesByWorkspaceIdQuery } from "../store/notes-api";

const EMPTY_ARRAY: never[] = [];

export function useFavorites() {
  const workspaceId = useCurrentWorkspaceId();
  const { isFetching, isLoading } = useGetFavoritesByWorkspaceIdQuery(
    workspaceId ?? skipToken,
  );
  const noteIds = useAppSelector(
    (s) => (workspaceId ? selectFavoriteIds(s, workspaceId) : EMPTY_ARRAY),
    shallowEqual,
  );
  return {
    noteIds,
    isFetching,
    isLoading,
  };
}
