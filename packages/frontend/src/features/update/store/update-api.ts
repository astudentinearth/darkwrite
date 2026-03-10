import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const UPDATE_TAG_TYPE = "update";

export async function _updateQueryFn() {
  try {
    if (!window.isElectron)
      throw new Error("Not running in Electron environment");
    const result = await window.api.checkUpdate();
    if (!result) throw new Error("Update check failed");
    return { data: result };
  } catch (e) {
    return { error: e as Error };
  }
}

export const updateApi = createApi({
  reducerPath: "update",
  baseQuery: fakeBaseQuery(),
  tagTypes: [UPDATE_TAG_TYPE],
  keepUnusedDataFor: 60 * 15,
  endpoints: (builder) => ({
    checkUpdate: builder.query<
      Awaited<ReturnType<typeof window.api.checkUpdate>>,
      void
    >({
      queryFn: _updateQueryFn,
      providesTags: [UPDATE_TAG_TYPE],
    }),
  }),
});

export const { useLazyCheckUpdateQuery, useCheckUpdateQuery } = updateApi;
