import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteContent } from "@/common/note-content";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";

const persistContentDebounced = _.debounce((id: string, content: string) => DarkwriteAPIClient.note.setDocument(id, content), 200);

export function useNoteContent(id: string) {
  const query = useQuery({ queryKey: ["note-content", id] ,
    queryFn: async ()=> {
      const response = await DarkwriteAPIClient.note.getDocument(id);
      const { document } = response;
      return document;
    }
  });
  return query;
}

export type UpdateContentMutationOpts = {
  content: NoteContent,
  debounce?: boolean
}

export function useUpdateNoteContent(id: string) {
  const mutation = useMutation({
    mutationFn: async (opts: UpdateContentMutationOpts) => {
      const {content, debounce} = opts;
      const serializedContent = JSON.stringify(content);
      if(debounce) persistContentDebounced(id, serializedContent);
      else DarkwriteAPIClient.note.setDocument(id, serializedContent);
    }
  });
  return mutation;
}
