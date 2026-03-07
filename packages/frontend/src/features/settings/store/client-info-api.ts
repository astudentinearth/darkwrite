import { DarkwriteAPIClient } from "@/api/api-client";
import { DarkwriteDesktopClientInfo } from "@/common/client";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const clientInfoApi = createApi({
  reducerPath: "clientInfoApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getClientInfo: builder.query<DarkwriteDesktopClientInfo, void>({
      async queryFn() {
        try {
          const data = await DarkwriteAPIClient.desktop.getClientInfo();
          return { data };
        } catch (error) {
          return { error: error as Error };
        }
      },
    }),
  }),
});

export const { useGetClientInfoQuery } = clientInfoApi;
