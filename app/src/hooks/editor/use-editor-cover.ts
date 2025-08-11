import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO, NoteResponseDTO } from "@/common/dto";
import { useLocalStore } from "@/context/local-state";
import { useNotes } from "@/query/use-notes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";

const persistTitle = _.debounce((id: string, title: string) => {
  DarkwriteAPIClient.note.update(id, { title });
}, 200);

function useUpdateTitleOptimistic(id: string) {
  const qc = useQueryClient();
  const workspaceId = useLocalStore((s) => s.workspaceId);
  return useMutation({
    mutationFn: async (title: string) => {
      persistTitle(id, title);
    },
    onSettled(_data, _error, title) {
      qc.setQueryData(["note", id], (curent: NoteResponseDTO) => {
        const copy = { ...curent.note };
        copy.title = title;
        return copy;
      });
      qc.setQueryData(
        //TODO: MAKE THE NOTE API USE MAPS **ASAP** WHAT THE HELL IS THIS
        [workspaceId, "notes"],
        (current: { notes: NoteDTO[]; nextFavoriteHint: string }) => {
          const copy = [...current.notes];
          for(const note of copy) {
            if(note.id !== id) continue;
            note.title = title;
            break;
          }
          return {notes: copy, nextFavoriteHint: current.nextFavoriteHint}
        },
      );
    },
  });
}

export default function useEditorCover(noteId: string) {
  const titleMutation = useUpdateTitleOptimistic(noteId);
  const updateTitle = (title: string) => {
    titleMutation.mutate(title);
  };
  return { updateTitle };
}
