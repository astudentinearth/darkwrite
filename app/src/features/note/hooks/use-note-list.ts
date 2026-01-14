import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO, NotesResponseDTO } from "@/common/dto";
import { NOTE_QUERY_KEY, NoteQuery } from "./use-note";
import { useLocalStore } from "@/context/local-state";
import { useQuery } from "@tanstack/react-query";
import { OrderKey } from "@/common/note";
import { Rank } from "@/common/rank";
import { useCallback, useMemo } from "react";

const DEFAULT_DELIMITER = "$";

export function combineIds(notes: NoteDTO[], delimiter = DEFAULT_DELIMITER) {
  // IDs are UUIDs, so no risk of collision
  return notes.map((note) => note.id).join(delimiter);
}

function splitIds(idString: string, delimiter = DEFAULT_DELIMITER) {
  return idString ? idString.split(delimiter) : [];
}

export async function fetchListState(
  workspaceId: string,
  parentId: string | null,
): Promise<NoteQuery> {
  const response = await DarkwriteAPIClient.note.getByParentId(
    workspaceId,
    parentId,
  );
  return { notes: response.notes };
}

export function getSortedIds(
  response: NotesResponseDTO,
  sortKey: OrderKey = "orderHint",
) {
  const notes = Object.values(response.notes).toSorted((a, b) =>
    Rank.sorter(a[sortKey], b[sortKey]),
  );
  const concatenatedIds = combineIds(notes);
  return concatenatedIds;
}

function NOTE_LIST_QUERY_KEY(parentId: string | null) {
  return [NOTE_QUERY_KEY, "list", parentId];
}

export function selectIds(query: NoteQuery, sortKey: OrderKey = "orderHint") {
  return getSortedIds({ notes: query.notes }, sortKey);
}

export function useNoteList(
  parentId: string | null,
  sortKey: OrderKey = "orderHint",
) {
  const workspaceId = useLocalStore((s) => s.workspaceId);

  const select = useCallback(
    (data: NoteQuery) => selectIds(data, sortKey),
    [sortKey],
  );

  const { data: idString } = useQuery({
    queryKey: NOTE_LIST_QUERY_KEY(parentId),
    queryFn: () => fetchListState(workspaceId, parentId),
    select,
  });

  const noteIds: string[] = useMemo(
    () => (idString ? splitIds(idString) : []),
    [idString],
  );

  return {
    noteIds,
  };
}
