import { UpdateNoteDTO } from "@darkwrite/common";
import { Note } from "@darkwrite/common/models";
import { NoteAPI } from "@/api";
import { APIClient } from "@/apiv2/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (opts: {id: string , dto: UpdateNoteDTO}) => {
      const data = await APIClient.instance.note.update(opts.id , opts.dto);
      if(!data) throw new Error();
      return data.note;
    },

    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["note", variables.id],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldData: any) => {
          if (!oldData) return;
          console.log("Updating cache");
          console.log(oldData);
          return {
            ...oldData, ..._data
          };
        },
      );
      //queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.refetchQueries({queryKey: ["notes"]})
    },
    onError(err) {
      console.error(err);
    },
  });
};

export const useUpdateMultipleNotesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedNotes: Note[]) =>
      NoteAPI().saveAll(updatedNotes),

    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["notes"] });
    },
    onError(err) {
      console.error(err);
    },
  });
};
