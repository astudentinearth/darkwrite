import type { UpdateServerResponse } from "@darkwrite/common";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { DarkwriteAPIClient } from "@/api/api-client";
import { resultQueryFn } from "@/lib/query-result";

export const UPDATE_TAG_TYPE = "update";

export const updateApi = createApi({
  reducerPath: "update",
  baseQuery: fakeBaseQuery(),
  tagTypes: [UPDATE_TAG_TYPE],
  keepUnusedDataFor: 60 * 15,
  endpoints: (builder) => ({
    checkUpdate: builder.query<UpdateServerResponse | undefined, void>({
      queryFn: resultQueryFn(() => DarkwriteAPIClient.checkUpdate()),
      providesTags: [UPDATE_TAG_TYPE],
    }),
  }),
});

export const { useLazyCheckUpdateQuery, useCheckUpdateQuery } = updateApi;
