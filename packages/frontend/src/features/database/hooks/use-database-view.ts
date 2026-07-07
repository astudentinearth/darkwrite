import type { DatabaseViewMeta, NoteDTO } from "@darkwrite/common";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "@/features/store/hooks";
import { selectDatabaseViewById } from "../store/database-selectors";
import { useGetDatabaseViewQuery } from "../store/database-view-api";

interface DatabaseViewResult {
  note: NoteDTO | null;
  meta: DatabaseViewMeta | null;
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export function useDatabaseView(id: string | undefined): DatabaseViewResult {
  const meta = useAppSelector((state) =>
    id ? selectDatabaseViewById(state, id) : null,
  );
  const { data, isFetching, isError, isLoading, error } =
    useGetDatabaseViewQuery(meta ? skipToken : id ? id : skipToken);
  return {
    note: data?.note ?? null,
    meta: data?.meta ?? null,
    isFetching,
    isLoading,
    isError,
    error,
  };
}
