import { DarkwriteAPIClient } from "@/api/api-client";
import { CreateNoteDTO } from "@/common/dto";
import { useLocalStore } from "@/context/local-state";
import { useMutation } from "@tanstack/react-query";

export const useCreateNoteMutation = () => {
  const workspaceId = useLocalStore((s) => s.workspaceId);

  const mutation = useMutation({
    mutationFn: DarkwriteAPIClient.note.create,
  });

  const create = (opts: {
    title?: string;
    icon?: string;
    parentId?: string;
  }) => {
    const dto: CreateNoteDTO = {
      workspaceId,
      title: "Untitled",
      favoriteOrderHint: "",
      orderHint: "",
      ...opts,
    };
    mutation.mutateAsync(dto);
  };
  const { isPending } = mutation;
  return { create, isPending };
};
