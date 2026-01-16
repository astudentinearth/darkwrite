import { DarkwriteAPIClient } from "@/api/api-client";
import { useMutation } from "@tanstack/react-query";
import { useLocalStore } from "@/context/local-state";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";

/** @deprecated */
export default function useDuplicateNote(navigateAfter = false) {
  const workspaceId = useLocalStore((s) => s.workspaceId);
  const nav = useNavigateToNote();
  return useMutation({
    mutationFn: DarkwriteAPIClient.note.duplicate,
    onSuccess(data, variables, onMutateResult, context) {
      context.client
        .refetchQueries({ queryKey: [workspaceId, "notes"] })
        .then(() => {
          if (data.note == null) return;
          if (navigateAfter) nav(data.note.id);
        });
    },
  });
}
