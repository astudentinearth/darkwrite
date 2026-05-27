import { DarkwriteAPIClient } from "@/api/api-client";
import { resultQueryFn } from "@/lib/query-result";
import type { FileLinkMetadata } from "@darkwrite/common";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const FILE_LINK_API_REDUCER_PATH = "fileLinkApi";
export const FILE_LINK_TAG_TYPE = "FileLink" as const;

export function fileLinkByIdTag(id: string): {
  type: typeof FILE_LINK_TAG_TYPE;
  id: string;
} {
  return { type: FILE_LINK_TAG_TYPE, id };
}

export const fileLinkApi = createApi({
  reducerPath: FILE_LINK_API_REDUCER_PATH,
  baseQuery: fakeBaseQuery(),
  tagTypes: [FILE_LINK_TAG_TYPE],
  endpoints: (builder) => ({
    getFileLinkById: builder.query<FileLinkMetadata, string>({
      queryFn: resultQueryFn((id: string) =>
        DarkwriteAPIClient.fileLink.getById(id),
      ),
      providesTags: (_result, _error, id) => [fileLinkByIdTag(id)],
    }),
  }),
});

export const { useGetFileLinkByIdQuery } = fileLinkApi;
