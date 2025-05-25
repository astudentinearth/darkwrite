import { NoteCustomizations } from "@darkwrite/common";
import { NoteAPI } from "@renderer/api";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { JSONContent } from "novel";
import { useUpdateNoteMutation } from "./use-update-note-mutation";

export const debouncedSave = _.debounce(
  async (id: string, content: string, callback?: () => void) => {
    console.log("Saving note to disk...", id,content);
    await NoteAPI().updateContents(id, content);
    callback?.call(null);
  },
  200,
);

export type NoteContentsMutationData = {
  noteData: {
    contents: JSONContent,
    customizations: NoteCustomizations
  },
  noDebounce?: boolean
}

export const useNoteContentsMutation = (id: string) => {
  //const queryClient = useQueryClient();
  const update = useUpdateNoteMutation().mutate;
  return useMutation({
    mutationKey: ["update-contents", id],
    mutationFn: async (
      opts: NoteContentsMutationData
    ) => {
      if (!id) return;
      const str = JSON.stringify(opts.noteData);
      if (!opts.noDebounce)
        debouncedSave(id, str, () => {
          update({ id, modified: new Date() });
        });
      else await NoteAPI().updateContents(id, str);
    },
  });
};
