import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const EDITOR_API_NAME = "editorApi";

export const editorApi = createApi({
  baseQuery: fakeBaseQuery(),
  reducerPath: EDITOR_API_NAME,
  endpoints: (builder) => ({}),
});
