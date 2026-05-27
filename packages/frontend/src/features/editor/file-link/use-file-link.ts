import type { FileLinkMetadata } from "@darkwrite/common";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetFileLinkByIdQuery } from "./file-link-api";

export type UseFileLinkResult = {
  fileLink: FileLinkMetadata | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
};

export function useFileLink(id: string | null): UseFileLinkResult {
  const { data, isLoading, isFetching, isError } = useGetFileLinkByIdQuery(
    id ?? skipToken,
  );
  return { fileLink: data, isLoading, isFetching, isError };
}
