import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO } from "@/common/dto";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * All useQuery calls with the notes query key must extend this interface.
 */
export interface NoteQuery {
  notes: Record<string, NoteDTO>;
}

export const NOTE_QUERY_KEY = "notes";

export function updateNoteCache(queryClient: QueryClient, note: NoteDTO) {
  queryClient.setQueriesData(
    {
      queryKey: [NOTE_QUERY_KEY],
    },
    (old: NoteQuery | undefined) => {
      if (!old?.notes[note.id]) return old;
      return {
        ...old,
        notes: {
          ...old.notes,
          [note.id]: note,
        },
      } satisfies NoteQuery;
    },
  );
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (opts: { id: string; dto: NoteDTO }) =>
      DarkwriteAPIClient.note.update(opts.id, opts.dto),

    onMutate(vars) {
      updateNoteCache(queryClient, vars.dto);
    },

    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: [NOTE_QUERY_KEY] });
      if (data.note) {
        updateNoteCache(queryClient, data.note);
      }
    },
  });

  const { isPending } = mutation;
  return {
    update: mutation.mutateAsync,
    isPending,
  };
}
