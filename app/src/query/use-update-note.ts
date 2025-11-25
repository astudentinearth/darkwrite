import { DarkwriteAPIClient } from "@/api/api-client";
import { UpdateNoteDTO } from "@/common/dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStore } from "@/context/local-state";

export const useUpdateNote = () => {
  const workspaceId = useLocalStore((s) => s.workspaceId);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (opts: { id: string; dto: UpdateNoteDTO }) =>
      DarkwriteAPIClient.note.update(opts.id, opts.dto),
    onSuccess(data, variables) {
      queryClient.invalidateQueries({ queryKey: [workspaceId, "notes"] });
      queryClient.setQueryData(["note", variables.id], { note: data.note });
    },
  });
  const { isPending } = mutation;
  return {
    update: mutation.mutateAsync,
    isPending,
  };
};
