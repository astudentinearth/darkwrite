import { useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { selectFavorites } from "../store/note-selectors";
import { shallowEqual } from "react-redux";
import { useGetFavoritesByWorkspaceIdQuery } from "../store/notes-api";
import { skipToken } from "@reduxjs/toolkit/query";

const EMPTY_ARRAY: never[] = [];

export function useFavorites() {
  const workspaceId = useCurrentWorkspaceId();
  const { isFetching, isLoading } = useGetFavoritesByWorkspaceIdQuery(
    workspaceId ?? skipToken,
  );
  const noteIds = useAppSelector(
    (s) => (workspaceId ? selectFavorites(s, workspaceId) : EMPTY_ARRAY),
    shallowEqual,
  );
  return {
    noteIds,
    isFetching,
    isLoading,
  };
}
