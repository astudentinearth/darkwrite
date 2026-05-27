import type { NoteDTO } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import { resultQueryFn } from "@/lib/query-result";
import { upsertNotes } from "./note-slice";
import { NOTES_TAG_TYPE, notesApi } from "./notes-api";
import type { SearchArgs } from "./types";

export function _searchTag(args: SearchArgs) {
  return `SEARCH_${args.workspaceId}_${args.query}`;
}

export const searchApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<NoteDTO[], SearchArgs>({
      queryFn: resultQueryFn((args: SearchArgs) =>
        args.query === ""
          ? okAsync([] as NoteDTO[])
          : DarkwriteAPIClient.note
              .search(args.workspaceId, args.query)
              .map(({ notes }) => Object.values(notes)),
      ),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data));
        } catch {
          /* empty */
        }
      },
      providesTags: (_result, _error, args) => [
        {
          type: NOTES_TAG_TYPE,
          id: _searchTag(args),
        },
      ],
    }),
  }),
});

export const { useSearchQuery, useLazySearchQuery } = searchApi;
