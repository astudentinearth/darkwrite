import { resultQueryFn } from "@/lib/query-result";
import { dwErrAsync, UpdateServerResponse } from "@darkwrite/common";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const UPDATE_TAG_TYPE = "update";

export const updateApi = createApi({
  reducerPath: "update",
  baseQuery: fakeBaseQuery(),
  tagTypes: [UPDATE_TAG_TYPE],
  keepUnusedDataFor: 60 * 15,
  endpoints: (builder) => ({
    checkUpdate: builder.query<UpdateServerResponse | undefined, void>({
      queryFn: resultQueryFn(() =>
        window.isElectron
          ? window.api.checkUpdate()
          : dwErrAsync("Not running in Electron environment"),
      ),
      providesTags: [UPDATE_TAG_TYPE],
    }),
  }),
});

export const { useLazyCheckUpdateQuery, useCheckUpdateQuery } = updateApi;
