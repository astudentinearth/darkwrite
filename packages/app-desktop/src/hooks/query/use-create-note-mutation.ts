import { APIClient } from "@/apiv2/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigateToNote } from "../use-navigate-to-note";


export const useCreateNoteMutation = (navigateAfter: boolean = false) => {
  const nav = useNavigateToNote();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (parentId?: string) => {
      const response = await APIClient.instance.note.create({
        title: "Untitled",
        workspaceId: "",
        parentId
      });
      if (!response) throw new Error("Failed to create note");
      return response.note;
    },
    onSuccess: async (note) => {
      await queryClient.refetchQueries({ queryKey: ["notes"] });
      if (navigateAfter) nav(note.id);
    },
    onError(error) {
      toast(error.message);
    },
  });
};
