import { skipToken } from "@reduxjs/toolkit/query";
import { shallowEqual } from "react-redux";
import { selectDatabasesInWorkspace } from "@/features/note/store/note-selectors";
import { useGetDatabasesInWorkspaceQuery } from "@/features/note/store/notes-api";
import { useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";

const EMPTY_ARRAY: never[] = [];

/**
 * Fetches all non-trashed Database-type notes in the given workspace and
 * selects their IDs from the central Redux store.
 */
export function useDatabasesInWorkspace(workspaceId: string | undefined) {
  const { isFetching, isLoading } = useGetDatabasesInWorkspaceQuery(
    workspaceId ?? skipToken,
  );
  const databaseIds = useAppSelector(
    (s) =>
      workspaceId ? selectDatabasesInWorkspace(s, workspaceId) : EMPTY_ARRAY,
    shallowEqual,
  );
  return {
    databaseIds,
    isFetching,
    isLoading,
  };
}

/**
 * Convenience wrapper around {@link useDatabasesInWorkspace} that
 * automatically uses the currently active workspace.
 */
export function useAvailableDatabases() {
  const workspaceId = useCurrentWorkspaceId();
  return useDatabasesInWorkspace(workspaceId ?? undefined);
}
