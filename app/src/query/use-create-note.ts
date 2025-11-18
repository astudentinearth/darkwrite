import { DarkwriteAPIClient } from "@/api/api-client";
import { CreateNoteDTO } from "@/common/dto";
import { useLocalStore } from "@/context/local-state";
import { useMutation } from "@tanstack/react-query";
import { useNotes } from "./use-notes";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";

export const useCreateNoteMutation = (navigateAfter = false) => {
  const workspaceId = useLocalStore((s) => s.workspaceId);
  const nav = useNavigateToNote();
  const notesQuery = useNotes();

  const mutation = useMutation({
    mutationFn: DarkwriteAPIClient.note.create,
    onSuccess(data, variables, result, context) {
      context.client.invalidateQueries({ queryKey: [workspaceId, "notes"] });
      notesQuery.refetch().then(() => {
        if (navigateAfter && data.note) nav(data.note?.id);
      });
    },
  });

  const create = (opts: {
    title?: string;
    icon?: string;
    parentId?: string;
    orderHint?: string;
  }) => {
    const dto: CreateNoteDTO = {
      workspaceId,
      title: "Untitled",
      favoriteOrderHint: "",
      ...opts,
    };
    mutation.mutateAsync(dto);
  };
  const { isPending } = mutation;
  return { create, isPending };
};
