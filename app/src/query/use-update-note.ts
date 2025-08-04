import { DarkwriteAPIClient } from "@/api/api-client"
import { UpdateNoteDTO } from "@/common/dto"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNotes } from "./use-notes";

export const useUpdateNote = () => {
  const notesQuery = useNotes();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (opts: {id: string, dto: UpdateNoteDTO}) => DarkwriteAPIClient.note.update(opts.id, opts.dto),
    onSuccess(data, variables) {
      notesQuery.refetch();
      queryClient.setQueryData(["note", variables.id], data.note);
    }
  })
  const { isPending } = mutation;
  return {
    update: mutation.mutateAsync,
    isPending
  }
}