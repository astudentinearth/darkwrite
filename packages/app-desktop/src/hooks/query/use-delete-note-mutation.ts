import { NoteAPI } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteNoteMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await NoteAPI().delete(id);
    },

    onSuccess(_data, id) {
      client.refetchQueries({ queryKey: ["notes"] });
      client.invalidateQueries({ queryKey: ["note", id] });
    },
    onError(err) {
      console.error(err);
    },
  });
};
