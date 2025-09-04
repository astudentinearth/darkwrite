import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO, NoteResponseDTO } from "@/common/dto";
import { useLocalStore } from "@/context/local-state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import {produce} from "immer";

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
      qc.setQueryData(["note", id], (current: NoteResponseDTO) => {
        const copy = { ...current.note };
        copy.title = title;
        return {note: copy};
      });
      qc.setQueryData(
        [workspaceId, "notes"],
        (current: { notes: Record<string, NoteDTO>; nextFavoriteHint: string }) => {
          const copy = produce(current.notes, draft => {
            draft[id].title = title;
          })
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
