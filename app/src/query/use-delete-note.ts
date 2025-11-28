import { DarkwriteAPIClient } from "@/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentWorkspace } from "./use-workspace";
import { useNoteFromURL } from "./use-note-from-url";
import { useNavigate } from "react-router-dom";

export default function useDeleteNote() {
  const qc = useQueryClient();
  const workspace = useCurrentWorkspace();
  const currentNoteId = useNoteFromURL();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (id: string) => {
      DarkwriteAPIClient.note.delete(id);
    },
    onSuccess(data, variables) {
      if (currentNoteId == variables) {
        navigate("/");
      }
      qc.invalidateQueries({ queryKey: [workspace?.id, "notes"] });
    },
  });
}
