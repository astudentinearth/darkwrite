import { DarkwriteAPIClient } from "@/api/api-client";
import { resultQueryFn } from "@/lib/query-result";
import { DarkwriteDesktopClientInfo } from "@darkwrite/common";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const clientInfoApi = createApi({
  reducerPath: "clientInfoApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getClientInfo: builder.query<DarkwriteDesktopClientInfo, void>({
      queryFn: resultQueryFn(() => DarkwriteAPIClient.desktop.getClientInfo()),
    }),
  }),
});

export const { useGetClientInfoQuery } = clientInfoApi;
