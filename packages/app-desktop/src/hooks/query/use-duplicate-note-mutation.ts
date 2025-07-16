import { NoteAPI } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDuplicateNoteMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await NoteAPI().duplicate(id);
    },

    onSuccess: () => {
      client.refetchQueries({ queryKey: ["notes"] });
    },
  });
};
