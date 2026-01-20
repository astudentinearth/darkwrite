import { useAppSelector } from "@/features/store/hooks";
import { selectNoteById } from "../store/note-selectors";

/**
 * Hook to get note data **within sidebar views.** Do NOT use this to
 * render arbitrary items. This expects the note to exist within cache.
 * @param id
 */
export function useNoteItem(id: string) {
  const note = useAppSelector((state) => selectNoteById(state, id));

  if (!note) return null;
  return note;
}
