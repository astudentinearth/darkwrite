import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO, NoteResponseDTO } from "@/common/dto";
import { useLocalStore } from "@/context/local-state";
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
        [workspaceId, "notes"],
        (current: { notes: Record<string, NoteDTO>; nextFavoriteHint: string }) => {
          const copy = {...current.notes};
          copy[id].title = title;
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
