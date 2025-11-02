import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO } from "@/common/dto";
import { Rank } from "@/common/rank";
import { useLocalStore } from "@/context/local-state";
import { useQuery } from "@tanstack/react-query";

export interface NotesQueryData {
  notes: Record<string, NoteDTO>;
  nextFavoriteHint: string;
  finalOrderHint: string;
}

export async function notesFetcher(workspaceId: string) {
  const response =
    await DarkwriteAPIClient.note.getAllByWorkspaceId(workspaceId);
  const { notes } = response;
  const noteList = Object.values(notes);

  const favorites = Object.values(notes)
    ?.filter((n) => n.isFavorite && !n.isTrashed)
    .toSorted((a, b) => Rank.sorter(a.favoriteOrderHint, b.favoriteOrderHint));
  let nextFavoriteHint = "";
  if (!favorites || favorites?.length == 0)
    nextFavoriteHint = Rank.default().toString();
  else
    nextFavoriteHint = new Rank(
      favorites[favorites.length - 1].favoriteOrderHint,
    )
      .next()
      .toString();

  let finalOrderHint: string = "";
  if (notes == null || noteList.length == 0)
    finalOrderHint = Rank.default().next().toString();
  else {
    const lastOrderHint = new Rank(noteList[noteList.length - 1].orderHint);
    finalOrderHint = lastOrderHint.next().toString();
  }

  return { notes, nextFavoriteHint, finalOrderHint };
}

export const useNotes = () => {
  const workspaceId = useLocalStore((s) => s.workspaceId);

  const query = useQuery({
    queryKey: [workspaceId, "notes"],
    queryFn: () => notesFetcher(workspaceId),
  });

  const { data, isFetching, refetch } = query;
  return {
    notes: data?.notes,
    nextFavoriteHint: data?.nextFavoriteHint,
    isFetching,
    refetch,
    finalOrderHint: data?.finalOrderHint,
  };
};
