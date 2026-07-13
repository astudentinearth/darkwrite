import type {
  CreateDatabaseViewArgs,
  CreateDatabaseViewResponse,
  GetDatabaseViewResponse,
  GetViewsByIdResponse,
  GetViewsOfResponse,
} from "@darkwrite/common";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { DarkwriteAPIClient } from "@/api/api-client";
import { upsertNotes } from "@/features/note/store/note-slice";
import { resultQueryFn } from "@/lib/query-result";
import { upsertView, upsertViews } from "./database-view-slice";

export const DATABASE_VIEW_TAG_TYPE = "databaseView";

export function databaseViewTag(id: string) {
  return `DATABASE_VIEW_${id}`;
}

export function viewsOfDatabaseTag(databaseId: string) {
  return `VIEWS_OF_DATABASE_${databaseId}`;
}

export function viewsByIdTag(ids: string[]) {
  return `VIEWS_BY_ID_${[...ids].sort().join(",")}`;
}

export const databaseViewApi = createApi({
  baseQuery: fakeBaseQuery(),
  reducerPath: "database-view-api",
  tagTypes: [DATABASE_VIEW_TAG_TYPE],
  endpoints: (builder) => ({
    createDatabaseView: builder.mutation<
      CreateDatabaseViewResponse,
      CreateDatabaseViewArgs
    >({
      queryFn: resultQueryFn((args) =>
        DarkwriteAPIClient.database.createDatabaseView(args),
      ),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes([data.note]));
          dispatch(upsertView(data.meta));
        } catch {
          /* empty */
        }
      },
    }),

    getDatabaseView: builder.query<GetDatabaseViewResponse, string>({
      queryFn: resultQueryFn((arg) =>
        DarkwriteAPIClient.database.getDatabaseView(arg),
      ),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes([data.note]));
          dispatch(upsertView(data.meta));
        } catch {
          /* empty */
        }
      },
      providesTags: (_result, _error, id) =>
        _result
          ? [{ type: DATABASE_VIEW_TAG_TYPE, id: databaseViewTag(id) }]
          : [],
    }),

    getViewsOf: builder.query<GetViewsOfResponse, string>({
      queryFn: resultQueryFn((databaseId: string) =>
        DarkwriteAPIClient.database.getViewsOf(databaseId),
      ),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data.notes));
          dispatch(upsertViews(data.views));
        } catch {
          /* empty */
        }
      },
      providesTags: (_result, _error, databaseId) =>
        _result
          ? [
              {
                type: DATABASE_VIEW_TAG_TYPE,
                id: viewsOfDatabaseTag(databaseId),
              },
            ]
          : [],
    }),

    getViewsById: builder.query<GetViewsByIdResponse, string[]>({
      queryFn: resultQueryFn((ids: string[]) =>
        DarkwriteAPIClient.database.getViewsById(ids),
      ),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data.notes));
          dispatch(upsertViews(data.views));
        } catch {
          /* empty */
        }
      },
      providesTags: (_result, _error, ids) =>
        _result
          ? [
              {
                type: DATABASE_VIEW_TAG_TYPE,
                id: viewsByIdTag(ids),
              },
            ]
          : [],
    }),
  }),
});

export const {
  useCreateDatabaseViewMutation,
  useGetDatabaseViewQuery,
  useGetViewsOfQuery,
  useGetViewsByIdQuery,
} = databaseViewApi;
