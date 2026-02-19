import { NoteDTO } from "@/common/dto";
import { NOTES_TAG_TYPE, notesApi } from "./notes-api";
import { DarkwriteAPIClient } from "@/api/api-client";
import { upsertNotes } from "./note-slice";
import { SearchArgs } from "./types";

export function _searchTag(args: SearchArgs) {
  return `SEARCH_${args.workspaceId}_${args.query}`;
}

export const _searchQueryFn = async (args: SearchArgs) => {
  if (args.query == "") return { data: [] };
  try {
    const { notes } = await DarkwriteAPIClient.note.search(
      args.workspaceId,
      args.query,
    );
    return {
      data: Object.values(notes),
    };
  } catch (e) {
    return { error: e as Error };
  }
};

export const searchApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<NoteDTO[], SearchArgs>({
      queryFn: _searchQueryFn,
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
