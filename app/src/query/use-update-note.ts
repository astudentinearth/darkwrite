import { DarkwriteAPIClient } from "@/api/api-client"
import { UpdateNoteDTO } from "@/common/dto"
import { useMutation } from "@tanstack/react-query"
import { useNotes } from "./use-notes";

export const useUpdateNote = () => {
  const notesQuery = useNotes();
  const mutation = useMutation({
    mutationFn: (opts: {id: string, dto: UpdateNoteDTO}) => DarkwriteAPIClient.note.update(opts.id, opts.dto),
    onSuccess() {
      notesQuery.refetch();
    }
  })
  const { isPending } = mutation;
  return {
    update: mutation.mutateAsync,
    isPending
  }
}