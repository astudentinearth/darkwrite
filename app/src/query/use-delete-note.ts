import { DarkwriteAPIClient } from "@/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentWorkspace } from "./use-workspace";

export default function useDeleteNote() {
  const qc = useQueryClient();
  const workspace = useCurrentWorkspace();
  return useMutation({
    mutationFn: async (id: string) => {
      DarkwriteAPIClient.note.delete(id);
    },
    onSuccess() {
      qc.invalidateQueries({queryKey: [workspace?.id, "notes"]})
    }
  });
}