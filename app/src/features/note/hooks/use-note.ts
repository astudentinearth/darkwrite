import { NoteDTO } from "@/common/dto";
import { useLocalStore } from "@/context/local-state";

/**
 * All useQuery calls with the notes query key must extend this interface.
 */
export interface NoteQuery {
  notes: Record<string, NoteDTO>;
}

export const NOTE_QUERY_KEY = "note";

export function useNotesByParent(parentId: string | undefined) {}
