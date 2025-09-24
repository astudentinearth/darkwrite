import { DarkwriteAPIClient } from "@/api/api-client";
import { CreateNoteDTO } from "@/common/dto";
import { Rank } from "@/common/rank";
import { useLocalStore } from "@/context/local-state";
import { useMutation } from "@tanstack/react-query";
import { useNotes } from "./use-notes";

export const useCreateNoteMutation = () => {
  const workspaceId = useLocalStore((s) => s.workspaceId);
  const notesQuery = useNotes();

  const mutation = useMutation({
    mutationFn: DarkwriteAPIClient.note.create,
    onSuccess() {
      notesQuery.refetch();
    }
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
