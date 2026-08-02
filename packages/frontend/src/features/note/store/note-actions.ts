import { useMemo } from "react";
import { navigateToNote } from "@/features/navigation/navigator";
import { useAppDispatch } from "@/features/store/hooks";
import type { AppDispatch } from "@/features/store/types";
import { createNoteApi } from "./create-note";

export const getNoteActions = (dispatch: AppDispatch) => ({
  async duplicateNote(id: string, navigateAfter = true) {
    dispatch(createNoteApi.endpoints.duplicateNote.initiate(id))
      .unwrap()
      .then((note) => {
        if (navigateAfter) navigateToNote(note.id);
      });
  },
});

export function useNoteActions() {
  const dispatch = useAppDispatch();
  const actions = useMemo(() => getNoteActions(dispatch), [dispatch]);
  return actions;
}
