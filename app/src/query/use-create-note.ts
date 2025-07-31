import { DarkwriteAPIClient } from "@/api/api-client";
import { CreateNoteDTO } from "@/common/dto";
import { useLocalStore } from "@/context/local-state";
import { useMutation } from "@tanstack/react-query";
import { useNotes } from "./use-notes";
import { LexoRank } from "lexorank";

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
  }) => {
    let orderHint: string = "";
    
    if(notesQuery.notes == null || notesQuery.notes.length == 0) orderHint = LexoRank.middle().genNext().toString();
    else {
      const lastOrderHint = LexoRank.parse(notesQuery.notes[notesQuery.notes.length - 1].orderHint);
      orderHint = lastOrderHint.genNext().toString();
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
