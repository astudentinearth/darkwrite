import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteContent } from "@/common/note-content";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";

export const persistContentDebounced = _.debounce(
  (id: string, content: string) =>
    DarkwriteAPIClient.note.setDocument(id, content),
  200,
);

export function useNoteContent(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["note-content", id];
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await DarkwriteAPIClient.note.getDocument(id);
      const { document } = response;
      return document;
    },
    enabled: !!id,
  });
  const overrideCache = (content: NoteContent) => {
    queryClient.setQueriesData(
      {
        queryKey,
      },
      content,
    );
  };
  return { ...query, overrideCache };
}

export type UpdateContentMutationOpts = {
  content: NoteContent;
  debounce?: boolean;
};
