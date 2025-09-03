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
    let orderHint: string = "";
    const notes = Object.values(notesQuery.notes ?? {})
    if(opts.orderHint) orderHint = opts.orderHint;
    else if(notesQuery.notes == null || notes.length == 0) orderHint = Rank.default().next().toString();
    else {
      const lastOrderHint = new Rank(notes[notes.length - 1].orderHint);
      orderHint = lastOrderHint.next().toString();
    }

    const dto: CreateNoteDTO = {
      workspaceId,
      title: "Untitled",
      favoriteOrderHint: "",
      orderHint,
      ...opts,
    };
    mutation.mutateAsync(dto);
  };
  const { isPending } = mutation;
  return { create, isPending };
};
